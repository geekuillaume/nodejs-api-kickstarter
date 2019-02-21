import * as PrettyError from 'pretty-error';

const pe = new PrettyError();

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
      throw new this(message, details);
    }
  }
}

class Unauthorized extends CustomError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, details);
  }

  static assert(test, message?: string, details?) {
    if (!test) {
      throw new this(message, details);
    }
  }
}

class BadRequest extends CustomError {
  constructor(message = 'Bad request', details) {
    super(message, 400, details);
  }

  static assert(test, message?: string, details?) {
    if (!test) {
      throw new this(message, details);
    }
  }
}

const prettyPrintError = (err) => {
  console.error(pe.render(err)); // eslint-disable-line
};

export {
  NotFound, Unauthorized, CustomError, BadRequest, prettyPrintError,
};
