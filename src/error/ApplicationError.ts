export class ApplicationError extends Error {
  public httpCode: number;
  constructor(message: string, httpCode?: number) {
    super(message);
    this.httpCode = httpCode || 500;
  }
}
