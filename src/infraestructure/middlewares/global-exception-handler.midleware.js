import { logMessage } from '../logs/logger.js';

export function globalExceptionHandler(err, req, res, _next) {
  logMessage(500, `${err?.message || err}`, {
    type: 'server-error',
    stack: err?.stack,
    url: req?.originalUrl,
    method: req?.method,
    body: req?.body,
    user: req?.user || null
  });
  res.status(500).json({message: 'Internal Server Error'});
}
