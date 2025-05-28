"use server";

import { makeApiRequest } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

// Define the expected API response structure
interface LanguageDetectApiResponse {
  language?: string;
  code?: string;
  lang?: string;
  name?: string;
  language_name?: string;
  confidence?: number;
  score?: number;
  [key: string]: any;
}

// Define the action return type
interface LanguageDetectResult {
  code: string;
  name: string;
  confidence?: number;
}

interface LanguageDetectActionResult {
  success: boolean;
  data?: LanguageDetectResult;
  error?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export async function detectLanguage(
  formData: FormData
): Promise<LanguageDetectActionResult> {
  const text = formData.get("text") as string;

  if (!text) {
    return { success: false, error: "Text is required" };
  }

  // Input validation
  if (text.trim().length < 2) {
    return { success: false, error: "Text must be at least 2 characters long" };
  }

  // Check for potential abuse (very large inputs)
  if (text.length > 5000) {
    return {
      success: false,
      error: "Text exceeds maximum length of 5,000 characters",
    };
  }

  try {
    // Check if we're being rate limited
    const rateLimitCheck = await checkRateLimit("language-detect");
    if (!rateLimitCheck.success) {
      return { success: false, error: rateLimitCheck.error };
    }

    const response = await makeApiRequest<LanguageDetectApiResponse>(
      "/language-detect",
      { text }
    );

    if (!response.success) {
      return { success: false, error: response.error };
    }

    const data = response.data;
    const result: LanguageDetectResult = {
      code: data?.language || "unknown",
      name: getLanguageName(data?.language || "unknown"),
      confidence: data?.confidence,
    };

    return {
      success: true,
      data: result,
      rateLimit: response.rateLimit,
    };
  } catch (error) {
    console.error("Language detection API error:", error);
    return {
      success: false,
      error: "Failed to connect to language detection service",
    };
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
    nl: "Dutch",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    pl: "Polish",
    tr: "Turkish",
    th: "Thai",
    vi: "Vietnamese",
  };
  return languages[code] || "Unknown Language";
}
