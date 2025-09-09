import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }
  
  return apiKey;
};

// Create a singleton instance of GoogleGenerativeAI
let genAI: GoogleGenerativeAI | null = null;

export const getGeminiAI = (): GoogleGenerativeAI => {
  if (!genAI) {
    try {
      const apiKey = getApiKey();
      genAI = new GoogleGenerativeAI(apiKey);
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      throw error;
    }
  }
  
  return genAI;
};

// Error handling helper
export const handleAIError = (error: unknown): string => {
  console.error('AI Service Error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('GEMINI_API_KEY_NOT_CONFIGURED')) {
      return 'AI service is not properly configured. Please contact support to resolve this issue.';
    } else if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
      return 'There is an issue with AI service configuration. Please contact support.';
    } else if (error.message.includes('RATE_LIMIT_EXCEEDED') || error.message.includes('429')) {
      return 'The AI service is currently busy. Please wait a moment and try again.';
    } else if (error.message.includes('SAFETY')) {
      return 'Content cannot be processed due to safety guidelines. Please modify your input.';
    } else if (error.message.includes('NETWORK_ERROR') || error.message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
  }
  
  return 'An unexpected error occurred. Please try again in a moment.';
};

// Common AI generation settings
export const AI_GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};