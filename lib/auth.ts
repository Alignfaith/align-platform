import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/security'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { profile: true },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          tier: user.tier,
          profileComplete: user.profile?.isComplete ?? false,
          mustChangePassword: user.mustChangePassword,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tier = user.tier
        token.profileComplete = user.profileComplete
        token.mustChangePassword = user.mustChangePassword
      }

      // Handle session updates (e.g., after profile completion or tier change)
      if (trigger === 'update' && session) {
        if (session.tier !== undefined) token.tier = session.tier
        if (session.profileComplete !== undefined) token.profileComplete = session.profileComplete
        if (session.mustChangePassword !== undefined) token.mustChangePassword = session.mustChangePassword
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.tier = token.tier as string
        session.user.profileComplete = token.profileComplete as boolean
        session.user.mustChangePassword = token.mustChangePassword as boolean
      }
      return session
    },
    async signIn({ user, account }) {
      // For OAuth, the profile will be created during onboarding
      if (account?.provider === 'google') {
        return true
      }
      return true
    },
  },
  events: {
    async signIn({ user }) {
      // Update last active timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      })
    },
  },
}
