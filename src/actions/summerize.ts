"use server";

import { makeApiRequest, sanitizeHtml } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

// Define the expected API response structure
interface SummarizeApiResponse {
  summary?: string;
  result?: string;
  [key: string]: any;
}

// Define the action return type
interface SummarizeActionResult {
  success: boolean;
  data?: string;
  error?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export async function summarizeText(
  formData: FormData
): Promise<SummarizeActionResult> {
  const text = formData.get("text") as string;
  const length = formData.get("length") as string;

  if (!text || !length) {
    return { success: false, error: "Missing required fields" };
  }

  // Input validation
  if (text.trim().length < 10) {
    return {
      success: false,
      error: "Text must be at least 10 characters long",
    };
  }

  // Check for potential abuse (very large inputs)
  if (text.length > 50000) {
    return {
      success: false,
      error: "Text exceeds maximum length of 50,000 characters",
    };
  }

  try {
    // Check if we're being rate limited
    const rateLimitCheck = await checkRateLimit("summarize");
    if (!rateLimitCheck.success) {
      return { success: false, error: rateLimitCheck.error };
    }

    const response = await makeApiRequest<SummarizeApiResponse>("/summarize", {
      text,
      length,
    });

    if (!response.success) {
      return { success: false, error: response.error };
    }

    // Sanitize the response to prevent XSS
    const summary =
      response.data?.summary || response.data?.result || response.data;

    // Ensure we always return a string
    const sanitizedResult =
      typeof summary === "string"
        ? sanitizeHtml(summary)
        : String(summary || "");

    return {
      success: true,
      data: sanitizedResult,
      rateLimit: response.rateLimit,
    };
  } catch (error) {
    console.error("Summarize API error:", error);
    return {
      success: false,
      error: "Failed to connect to summarization service",
    };
  }
}
