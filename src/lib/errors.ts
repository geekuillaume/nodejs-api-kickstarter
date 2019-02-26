import PrettyError from 'pretty-error';

interface ErrorOptions {
  status?: number;
  errcode?: string;
  message?: string;
  details?: any;
}

export class BaseHttpError extends Error {
  static status = 500;
  static errcode = 'UNKNOWN_ERROR';
  static message = 'An unknown error has occured';
  static details = {};

  status: number;
  errcode: string;
  message: string;
  details: any;

  constructor({
    status = 500, errcode = 'UNKNOWN_ERROR', message = 'An unknown error has occured', details = {},
  } = {}) {
    super();
    this.status = status;
    this.errcode = errcode;
    this.message = message;
    this.details = details;
  }

  static assert(test: any, options?: ErrorOptions) {
    if (!test) {
      throw new this(options);
    }
  }

  static extend({
    status, errcode, message, details,
  }: ErrorOptions) {
    const parent = this;
    return class extends this {
      static status = status || parent.status;
      static errcode = errcode || parent.errcode;
      static message = message || parent.message;
      static details = details || parent.details;

      constructor(overrides: ErrorOptions = {}) {
        super({
          status: overrides.status || status || parent.status,
          errcode: overrides.errcode || errcode || parent.errcode,
          message: overrides.message || message || parent.message,
          details: overrides.details || details || parent.details,
        });
      }
    };
  }
}

export const BadRequest = BaseHttpError.extend({
  status: 400,
  errcode: 'BAD_REQUEST',
  message: 'The server cannot understand your request',
});

export const Unauthorized = BaseHttpError.extend({
  status: 401,
  errcode: 'UNAUTHORIZED',
  message: 'You don\'t have the right to do this',
});

export const NotFound = BaseHttpError.extend({
  status: 404,
  errcode: 'NOT_FOUND',
  message: 'Not found',
});

export const ValidationError = BadRequest.extend({
  errcode: 'VALIDATION_ERROR',
  message: 'Request body is not valid',
});

export const InvalidAuthToken = Unauthorized.extend({
  errcode: 'INVALID_AUTH_TOKEN',
  message: 'Invalid authentication token',
});

const pe = new PrettyError();

export const prettyPrintError = (err) => {
  console.error(pe.render(err)); // eslint-disable-line
};
