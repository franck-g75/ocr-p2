import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Statistic } from 'src/app/core/models/Statistic';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  private destroy$ = new Subject<void>();

  public olympics$: Observable<Olympic[] | null> = of(null); //readonly copy of original data
  public getTopStat$: Observable<Number[] | null> = of(null); //for the two numbers below title
  public pieData: Statistic[] | null = null; //datas of the pie chart

  constructor(
    private olympicService: OlympicService,
    private myLog: MyLoggingService,
    private router: Router
  ) {  }

  /**
   * page initialization
   */
  ngOnInit(): void {

    this.myLog.debug("home.ngOnInit ");

    this.olympicService.getOlympics()
      .pipe(tap(val => this.myLog.info("home.tap..." + val)),takeUntil(this.destroy$))
      .subscribe(value => {

      //this part of code is read 2 times 
      //-the first time at the beginning where value is null
      //-the second time value = Olympic[]
      if (value != null){
        //get the numbers below the title
        this.getTopStat$ = this.olympicService.getTopStatHome();
        //get pieChartValues
        this.pieData = this.olympicService.getPieChartValues(value);
      }//value not null
    });//subscribe
    
  }//ngOnInit

/**
 * set the labels in the pie chart
 * @param name : this name will contain the name you defined in chartData[]
 * @returns void
 */
labelFormatting(name: string) { // this name will contain the name you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x: Statistic) => x.name == name); // chartData will be present in
                                                                     // series along with the label
    let nom: string = data[0].name;
    if (data[0].name.indexOf('.') > 0) {
      nom = data[0].name.split('.')[1];
    }
    if(data.length > 0) {
      return nom;//return `${data[0].name}`;
    } else {
      return name;
    }
  }

/**
 * detail link in the pie chart
 * @param pCountryEvent 
 */
goDetail(pCountryEvent: Statistic): void {
  this.myLog.info("CLIC!....   url?country=" + pCountryEvent.name.split('.')[0]);
  this.router.navigate(['/detail'], {queryParams: {country: pCountryEvent.name.split('.')[0]}});
}

/**
 * onDestroy function : unsubscribe the observable
 */
ngOnDestroy() {
  this.myLog.debug("Home.ngOnDestroy...");
  this.destroy$.unsubscribe(); 
}

}// class

