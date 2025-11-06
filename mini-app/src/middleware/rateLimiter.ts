import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// Store rate limit info per API key
const rateLimitStore = new Map<string, RateLimitInfo>();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 100; // Max requests per window

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get API key from header
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      error: 'API key required',
      message: 'Please provide an API key in the X-API-Key header',
    });
    return;
  }

  const now = Date.now();
  const rateLimitInfo = rateLimitStore.get(apiKey);

  // If no rate limit info exists or reset time has passed, create/reset it
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitStore.set(apiKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - 1);
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(now + RATE_LIMIT_WINDOW).toISOString()
    );

    next();
    return;
  }

  // Increment count
  rateLimitInfo.count++;

  // Check if limit exceeded
  if (rateLimitInfo.count > MAX_REQUESTS) {
    const resetTime = new Date(rateLimitInfo.resetTime).toISOString();
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', resetTime);

    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. Limit is ${MAX_REQUESTS} requests per minute`,
      resetTime: resetTime,
    });
    return;
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - rateLimitInfo.count);
  res.setHeader(
    'X-RateLimit-Reset',
    new Date(rateLimitInfo.resetTime).toISOString()
  );

  next();
};

// Clean up expired rate limit entries periodically
globalThis.setInterval(() => {
  const now = Date.now();
  for (const [key, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);
