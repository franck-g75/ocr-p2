import { RuntimeError } from "./RuntimeError"

export class CountryIdNotNumericError extends RuntimeError{
    constructor(pName: string, pMessage: string, pStatus?: number) {
      super(pName, pMessage, pStatus);
    }
}