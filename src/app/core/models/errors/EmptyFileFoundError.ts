import { RuntimeError } from "./RuntimeError"

export class EmptyFileFoundError extends RuntimeError{
    constructor(pName: string, pMessage: string, pStatus?: number) {
      super(pName, pMessage, pStatus);
    }
}