import { BaseError } from "./BaseError"

export class StartAtOneError extends BaseError{
    constructor(pName: string, pMessage: string, pStatus?: number) {
      super(pName, pMessage, pStatus);
    }
}