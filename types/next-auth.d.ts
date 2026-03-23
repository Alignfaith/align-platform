import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      tier: string
      profileComplete: boolean
      mustChangePassword: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: string
    tier: string
    profileComplete: boolean
    mustChangePassword: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    tier: string
    profileComplete: boolean
    mustChangePassword: boolean
  }
}
