interface RateLimitRecord {
  count: number;
  timestamp: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const rateLimits: Record<string, Record<string, RateLimitRecord>> = {};

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  summarize: { limit: 10, windowMs: 60 * 1000 },
  rewrite: { limit: 20, windowMs: 60 * 1000 },
  "language-detect": { limit: 30, windowMs: 60 * 1000 },
};

export async function checkRateLimit(endpoint: string, userId = "anonymous") {
  if (process.env.NODE_ENV === "development") {
    return { success: true };
  }

  const now = Date.now();

  if (!rateLimits[endpoint]) {
    rateLimits[endpoint] = {};
  }

  if (!rateLimits[endpoint][userId]) {
    rateLimits[endpoint][userId] = {
      count: 0,
      timestamp: now,
    };
  }

  const record = rateLimits[endpoint][userId];
  const config = RATE_LIMITS[endpoint] || { limit: 100, windowMs: 60 * 1000 };

  if (now - record.timestamp > config.windowMs) {
    record.count = 0;
    record.timestamp = now;
  }

  if (record.count >= config.limit) {
    const resetTime = record.timestamp + config.windowMs;
    const secondsToReset = Math.ceil((resetTime - now) / 1000);

    return {
      success: false,
      error: `Rate limit exceeded. Please try again in ${secondsToReset} seconds.`,
      rateLimit: {
        limit: config.limit,
        remaining: 0,
        reset: Math.floor(resetTime / 1000),
      },
    };
  }

  record.count++;

  return {
    success: true,
    rateLimit: {
      limit: config.limit,
      remaining: config.limit - record.count,
      reset: Math.floor((record.timestamp + config.windowMs) / 1000),
    },
  };
}
