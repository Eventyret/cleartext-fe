"use server";

import { sanitizeHtml } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

export async function summarizeText(formData: FormData) {
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

    // Replace with your actual API endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
      },
      body: JSON.stringify({ text, length }),
    });

    // Handle rate limiting
    if (response.status === 429) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Extract rate limit headers if available
    const rateLimit = {
      limit: Number.parseInt(response.headers.get("X-RateLimit-Limit") || "0"),
      remaining: Number.parseInt(
        response.headers.get("X-RateLimit-Remaining") || "0"
      ),
      reset: Number.parseInt(response.headers.get("X-RateLimit-Reset") || "0"),
    };

    // Dispatch rate limit info to client if available
    if (rateLimit.limit > 0) {
      // This will be handled in the client component
      console.log("Rate limit info:", rateLimit);
    }

    const data = await response.json();

    // Sanitize the response to prevent XSS
    const summary = data.summary || data.result || data;
    return {
      success: true,
      data: typeof summary === "string" ? sanitizeHtml(summary) : summary,
      rateLimit,
    };
  } catch (error) {
    console.error("Summarize API error:", error);
    return {
      success: false,
      error: "Failed to connect to summarization service",
    };
  }
}
