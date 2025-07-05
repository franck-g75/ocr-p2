/**
 * RuntimeErrors stop the program and show an error page
 */
export class RuntimeError extends Error {
  public readonly status?: number;
  constructor(pName: string, pMessage: string, pStatus?: number) {
    super(pMessage);
    this.name = pName;
    this.status = pStatus;
  }
}