/*eslint-disable */

declare namespace Express {
  interface User {
    [_: string]: any;
  }
  interface Request {
    user?: User;
  }
}

/*eslint-enable */
