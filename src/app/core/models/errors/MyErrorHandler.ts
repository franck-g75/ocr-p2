import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { MyLoggingService } from "../../services/my.loging.service";
import { BaseError } from "./BaseError";
import { RuntimeError } from "./RuntimeError";
import { Router } from '@angular/router';

/**
 * Error centralization
 */
@Injectable()
export class MyErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {super();}

  override handleError(error: any): void {
    const myloggingService = this.injector.get(MyLoggingService);
    const router = this.injector.get(Router);

    if (error instanceof BaseError){
      // Log the error in the console only
      myloggingService.error('BaseError found :', error);
    } else if (error instanceof RuntimeError) {
      //stop the prg and display an error message page
      myloggingService.fatal('RuntimeError found : ', error.message);
      alert('MyErrorHandler : RuntimeError found :' + error.message);
      router.navigate(['/error'], {queryParams: {msg:error.message.replace(/\s+/g,'_')}});
    }
  }
}
