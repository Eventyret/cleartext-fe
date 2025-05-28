// Common API helper functions

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export async function makeApiRequest<T>(
  endpoint: string,
  data: Record<string, any>,
  apiKey = process.env.API_KEY
): Promise<ApiResponse<T>> {
  try {
    if (!data) {
      return { success: false, error: "Missing required data" };
    }

    const response = await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey || "",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 429) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const rateLimit = {
      limit: Number.parseInt(response.headers.get("X-RateLimit-Limit") || "0"),
      remaining: Number.parseInt(
        response.headers.get("X-RateLimit-Remaining") || "0"
      ),
      reset: Number.parseInt(response.headers.get("X-RateLimit-Reset") || "0"),
    };

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
      rateLimit: rateLimit.limit > 0 ? rateLimit : undefined,
    };
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    return { success: false, error: "Failed to connect to service" };
  }
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
