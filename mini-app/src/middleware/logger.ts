import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

// Extend Express Request type to include requestId
declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
  }
}

// Simple UUID v4 generator
function generateUUID(): string {
  return randomBytes(16)
    .toString('hex')
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate unique request ID
  const requestId = generateUUID();
  req.requestId = requestId;

  // Log incoming request
  const startTime = Date.now();
  console.log(
    `[${requestId}] ${new Date().toISOString()} ${req.method} ${req.path}`
  );
  console.log(`[${requestId}] Query:`, req.query);
  console.log(`[${requestId}] Body:`, req.body);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${requestId}] ${res.statusCode} ${res.statusMessage} - ${duration}ms`
    );
  });

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);

  next();
};
