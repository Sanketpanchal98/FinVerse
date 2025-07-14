class ErrorHandler extends Error {
  constructor(
    status = 500,
    message = 'Something went wrong',
    error = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = status;
    this.message = message;
    this.error = error;
    this.stack = stack;
    this.data = null;
    this.success = false;
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorHandler;
