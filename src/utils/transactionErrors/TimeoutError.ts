export class TimeoutError extends Error {
  public timeout: boolean;

  constructor(message: string, txid?: string) {
    super(message);
    this.timeout = true;
  }
}
