
class CustomError extends Error {
  details: any; // eslint-disable-line
  status: number; // eslint-disable-line

  constructor(message: string, status: number, details) {
    super(message);
    this.details = details;
    this.status = status;
  }
}

class NotFound extends CustomError {
  constructor(message = 'Not found', details) {
    super(message, 404, details);
  }

  static assert(test, message?:string, details?) {
    if (!test) {
      throw new NotFound(message, details);
    }
  }
}

class Unauthorized extends CustomError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, details);
  }

  static assert(test, message?: string, details?) {
    if (!test) {
      throw new Unauthorized(message, details);
    }
  }
}

export { NotFound, Unauthorized, CustomError };
