"use server";

import { makeApiRequest, sanitizeHtml } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

// Define the expected API response structure
interface RewriteApiResponse {
  rewritten?: string;
  result?: string;
  [key: string]: any;
}

// Define the action return type
interface RewriteActionResult {
  success: boolean;
  data?: string;
  error?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export async function rewriteText(
  formData: FormData
): Promise<RewriteActionResult> {
  const text = formData.get("text") as string;
  const style = formData.get("style") as string;

  if (!text || !style) {
    return { success: false, error: "Missing required fields" };
  }

  // Input validation
  if (text.trim().length < 3) {
    return { success: false, error: "Text must be at least 3 characters long" };
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
    const rateLimitCheck = await checkRateLimit("rewrite");
    if (!rateLimitCheck.success) {
      return { success: false, error: rateLimitCheck.error };
    }

    const response = await makeApiRequest<RewriteApiResponse>("/rewrite", {
      text,
      style,
    });

    if (!response.success) {
      return { success: false, error: response.error };
    }

    // Sanitize the response to prevent XSS
    const rewritten =
      response.data?.rewritten || response.data?.result || response.data;

    // Ensure we always return a string
    const sanitizedResult =
      typeof rewritten === "string"
        ? sanitizeHtml(rewritten)
        : String(rewritten || "");

    return {
      success: true,
      data: sanitizedResult,
      rateLimit: response.rateLimit,
    };
  } catch (error) {
    console.error("Rewrite API error:", error);
    return { success: false, error: "Failed to connect to rewriting service" };
  }
}
