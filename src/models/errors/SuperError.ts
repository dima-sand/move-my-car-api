class SuperError {
  code: number;
  message: string;
  constructor(message: string, code?: number) {
    this.code = code ?? 500;
    this.message = message;
  }
}

export default SuperError;
