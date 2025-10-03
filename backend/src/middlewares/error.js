import httpStatus from 'http-status';

export function notFoundHandler(req, res, next) {
  res.status(httpStatus.NOT_FOUND).json({
    error: 'Not Found',
    path: req.originalUrl
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  res.status(status).json({ error: message, details });
}


