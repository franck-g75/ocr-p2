import { Injectable } from "@angular/core";

export enum LogLevel { All = 0, Debug = 1, Info = 2, Warn = 3, Error = 4, Fatal = 5, Off = 6 }

/**
 * usage : in a s file : 
 * inject : private myLog: MyLoggingService in constructor
 * write : this.myLog.debug("Home.ngOnDestroy..."); or this.myLog.info("CLIC!....   url?country=" + pCountryEvent.name.split('.')[0]);
 */

@Injectable({
  providedIn: 'root'
})
/**
 * logs centralization
 */
export class MyLoggingService {
  level: LogLevel = LogLevel.All; // Niveau de log global
  logWithDate: boolean = true;    // Afficher la date

  constructor(){
    this.writeToLog("loging.service constructor",LogLevel.Info, []);
  }

  /**
   * log debug function
   * @param msg the message to be written
   * @param optionalParams a table of anything
   */
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }
  /**
   * log info function
   * @param msg the message to be written
   * @param optionalParams a table of anything
   */
  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }
  /**
   * log warn function
   * @param msg the message to be written
   * @param optionalParams a table of anything
   */
  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }
  /**
   * log error function
   * @param msg the message to be written
   * @param optionalParams a table of anything
   */
  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }
  /**
   * log fatal function : when there is no alternatives
   * @param msg the message to be written
   * @param optionalParams a table of anything
   */
  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let logMsg = '';
      if (this.logWithDate) {
        const d: Date = new Date();
        logMsg += d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      }
      logMsg += ' ' + LogLevel[level] + ' ' + msg;
      if (params.length) {
        logMsg += ' - ' + this.formatParams(params);
      }
      console.log(logMsg);
    }
  }
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level && this.level !== LogLevel.Off;
  }
  private formatParams(params: any[]): string {
    return params.map(p => (typeof p === 'object') ? JSON.stringify(p) : p).join(', ');
  }

}