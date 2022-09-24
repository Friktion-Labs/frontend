export class CrossChainDepositError extends Error {
  info: string | undefined;

  constructor({ message, info }: { message: string; info?: string }) {
    super(message);
    this.name = "CrossChainDepositError";
    this.info = info;
  }
}
