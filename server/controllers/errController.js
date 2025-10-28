// server/controllers/errController.js
export default function globalErrorHandler(err, req, res, next) {
  // 避免重复发送响应
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const status = err.status || (String(statusCode).startsWith('4') ? 'fail' : 'error');

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    // 开发环境输出堆栈，线上可去掉
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
