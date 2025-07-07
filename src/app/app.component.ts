import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { MyLoggingService } from './core/services/my.loging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private olympicService: OlympicService,
    private myLog: MyLoggingService
  ) {
    this.myLog.debug('app appel du constructeur');
  }

  ngOnInit(): void {
    //Data loading for the home and the detail page. No reloading on page changing
    //Loading once, run any page...
    this.myLog.info("app : appel de load initial data...");
    this.olympicService.loadInitialData().pipe(take(1),tap(value=>console.log(value))).subscribe();
  }
}
 