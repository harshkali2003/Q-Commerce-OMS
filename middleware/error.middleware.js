const logger = require("../logger/logger");

const errorHandler = async (err, req, resp, next) => {
  logger.error("Unhandled error occurred", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.originalUrl,
    statusCode: err.statusCode || 500,
    userId: req.user?.userId,
    ip: req.ip,
    requestId: req.requestId,
  });

  const statusCode = err.statusCode || 500;

  resp.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
};

module.exports = errorHandler;
