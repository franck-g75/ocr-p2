import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
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

  public olympics$: Observable<Olympic[] | null> = of(null); //readonly copy of original data
  public getStat$: Observable<Number[] | null> = of(null); //for the two numbers below title
  public pieData: Statistic[] | null = null; //datas of the pie chart

  private myOlympicList: Olympic[] | null = [];

  constructor(
    private olympicService: OlympicService,
    private myLog: MyLoggingService,
    private router: Router
  ) {  }

  /**
   * 
   */
  ngOnInit(): void {

    this.myLog.info("home.ngOnInit ");

    this.olympicService.getOlympics().subscribe(value => {
      this.myOlympicList = value;
      this.myLog.info("home.ngOnInit : valeur trouvée, remplissage du tableau");
      const tabNb: number[] = [];
      try{
        this.myLog.info("home.ngOnInit : try push...");
        tabNb.push(this.olympicService.countNbJO());
        tabNb.push(this.olympicService.countNbCountries());
      } catch(e: any) {
        this.myLog.info("home.ngOnInit : push non fructueux");
      }

      this.myLog.info("home.ngOnInit tabNb.length=" + tabNb.length + ' : ' + tabNb[0] + ' ' + tabNb[1]);
      this.getStat$ = new BehaviorSubject<number[]>(tabNb).pipe(
        take(1),
        tap(value=>this.myLog.info("home.ngOnInit " + value.toString()))
      );

      this.pieData = new Array(0);
      //grab the numbers
      this.myOlympicList?.forEach((o)=>{
        this.myLog.info("home.ngOnInit pieData=" + o.country + ' ' + this.olympicService.getTotalMedals(o) ) ;
        let medalStat: Statistic = {name: o.id + '.' + o.country,value: this.olympicService.getTotalMedals(o)};
        this.pieData?.push(medalStat);
        });

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

}// class
