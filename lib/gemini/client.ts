/**
 * Gemini AI Client
 * Initializes and configures the Google Generative AI client
 */

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai'

// Environment validation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not configured - AI features will be disabled')
}

// Initialize the Generative AI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// Default generation configuration
const defaultConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
}

// Configuration for different use cases
export const modelConfigs = {
  compatibility: {
    ...defaultConfig,
    temperature: 0.5, // More consistent outputs for compatibility analysis
  },
  moderation: {
    ...defaultConfig,
    temperature: 0.1, // Very consistent for safety checks
    maxOutputTokens: 1024,
  },
  recommendations: {
    ...defaultConfig,
    temperature: 0.8, // More creative for recommendations
    maxOutputTokens: 2048,
  },
}

/**
 * Get a configured Gemini model instance
 */
export function getGeminiModel(config?: GenerationConfig): GenerativeModel | null {
  if (!genAI) {
    return null
  }

  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: config || defaultConfig,
  })
}

/**
 * Generate content with the Gemini model
 */
export async function generateContent(
  prompt: string,
  config?: GenerationConfig
): Promise<string | null> {
  const model = getGeminiModel(config)

  if (!model) {
    console.error('Gemini model not available - check API key configuration')
    return null
  }

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw error
  }
}

/**
 * Generate JSON-formatted content
 */
export async function generateJSON<T>(
  prompt: string,
  config?: GenerationConfig
): Promise<T | null> {
  const jsonPrompt = `${prompt}

IMPORTANT: Return ONLY valid JSON without markdown code blocks or any other formatting.`

  const result = await generateContent(jsonPrompt, config)

  if (!result) {
    return null
  }

  try {
    // Clean up the response - remove any markdown code blocks
    const cleanedResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    return JSON.parse(cleanedResult) as T
  } catch (error) {
    console.error('Error parsing Gemini JSON response:', error)
    console.error('Raw response:', result)
    throw new Error('Failed to parse AI response as JSON')
  }
}

/**
 * Check if Gemini is available
 */
export function isGeminiAvailable(): boolean {
  return !!genAI
}

/**
 * Get model information
 */
export function getModelInfo() {
  return {
    available: isGeminiAvailable(),
    model: GEMINI_MODEL,
  }
}
