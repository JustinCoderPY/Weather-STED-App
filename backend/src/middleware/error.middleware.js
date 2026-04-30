const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const handleError = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message: error.message || "Something went wrong."
  });
};

module.exports = {
  notFound,
  handleError
};
