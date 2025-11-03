import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

/**
 * Get or create the OpenAI client instance.
 * This is lazily initialized to avoid build-time errors when environment variables are not available.
 */
export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing OPENAI_API_KEY environment variable. Please set it in your environment variables."
      );
    }
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openaiClient;
}

