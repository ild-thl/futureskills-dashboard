export class APIErrorResponse implements Error {
  readonly name = 'APIErrorResponse';
  readonly ok = false;
  message: string;
  error: any | null;
  status: number;

  constructor(error: { error?: any; status: number; message?: string }) {
    this.error = error.error;
    this.status = error.status;
    this.message = error.message;
  }
}
