/**
 * BaseErrors are only logged
 */
export class BaseError extends Error {
  //public readonly name: string;
  //public readonly message: string;
  public readonly status?: number;
  constructor(pName: string, pMessage: string, pStatus?: number) {
    super(pMessage);
    this.name = pName;
    this.status = pStatus;
    //Object.setPrototypeOf(this, new.target.prototype);
  }
}
