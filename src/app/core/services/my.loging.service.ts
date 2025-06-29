import { Injectable } from "@angular/core";

export enum LogLevel { All = 0, Debug = 1, Info = 2, Warn = 3, Error = 4, Fatal = 5, Off = 6 }

@Injectable({
  providedIn: 'root',
})
/**
 * permet de centraliser les logs
 */
export class MyLoggingService {
  level: LogLevel = LogLevel.All; // Niveau de log global
  logWithDate: boolean = true;    // Afficher la date

  constructor(){
    //console.log('loging.service constructor');
    this.writeToLog("loging.service constructor",LogLevel.Info, []);
  }
/*
  private writetoLog(pMessage: string, letter: string): void{
    const d: Date = new Date();
    const m: string = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    switch (letter) {
      case 'E':
        console.error(m + ' E ' + pMessage);
      break;
      case 'W':
        console.warn(m + ' W ' + pMessage);
      break;
      case 'L':
        console.log(m + ' L ' + pMessage);
      break;
      case 'I':
        console.info(m + ' I ' + pMessage);
      break;

    }
  }

  error(pMesage: string): void{
    this.writetoLog(pMesage, "E");
  }
  warn(pMesage: string): void{
    this.writetoLog(pMesage, "W");
  }
  log(pMesage: string): void{
    this.writetoLog(pMesage, "L");
  }

  info(pMesage: string): void{
    this.writetoLog(pMesage, "I");
  }
*/







  debug(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }
  info(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }
  warn(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }
  error(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }
  fatal(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }
  private writeToLog(msg: any, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let logMsg = '';
      if (this.logWithDate) {
        const d: Date = new Date();
        logMsg += d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      }
      logMsg += ' ' + LogLevel[level].substring(0,1) + ' ' + msg;
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