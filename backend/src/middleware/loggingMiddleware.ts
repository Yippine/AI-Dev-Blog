// Logging Middleware
// LoggingMiddleware = RequestLogging + ResponseLogging + ErrorTracking

import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('user-agent') || 'Unknown';

  // Log request
  console.log(`[${new Date().toISOString()}] [REQUEST] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Capture original res.json and res.send
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Override res.json
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [RESPONSE] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalJson(body);
  };

  // Override res.send
  res.send = function(body: any) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [RESPONSE] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalSend(body);
  };

  next();
};

export const errorLoggingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const { method, url, ip } = req;
  console.error(`[${new Date().toISOString()}] [ERROR] ${method} ${url} - IP: ${ip} - Error: ${err.message}`);
  console.error(`[${new Date().toISOString()}] [ERROR_STACK] ${err.stack}`);
  next(err);
};