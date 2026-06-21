export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || "Internal server error" });
}
