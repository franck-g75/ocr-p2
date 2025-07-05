import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
import { DetailedStatistic } from 'src/app/core/models/DetailedStatistic';
import { CountryIdNotNumericError } from 'src/app/core/models/errors/CountryIdNotNumericError';
import { CountryNotFoundError } from 'src/app/core/models/errors/CountryNotFoundError';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { Statistic } from 'src/app/core/models/Statistic';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  //public olympics$: Observable<Olympic[] | null> = of(null);
  public getStat$: Observable<Number[] | null> = of(null);
  public countryName: string | null = null; 
  public lineData: DetailedStatistic[] | null = null; // datas of the line chart
  
  constructor(
      private olympicService: OlympicService,
      private myLog: MyLoggingService
    ) { }

  ngOnInit(): void {
    this.myLog.info("detail.ngOnInit...");
    
    let tabNb: number[] = [];         //a tab that will contain 3 numbers to write below the title
    let olympic: Olympic | null = null; //an object olympic to contain the country
    let countryParam: string = this.route.snapshot.queryParamMap.get('country')??"-1";

    //get the olympic object with the url parameter
    this.myLog.info("detail.ngOnInit  countryParam = |" + countryParam + "|");
    if (!Number.isInteger(parseInt(countryParam))){
      throw new CountryIdNotNumericError("CountryIdNotNumericError","l'identifiant " + countryParam + " passé en parametre n'est pas numeric");
    } else {//the number in the query paramter is really a number
      olympic = this.olympicService.getOlympicById(
        parseInt(countryParam)
      );
    }

    //check if the olympic object is found
    if (olympic == null){//not found send an error
      throw new CountryNotFoundError("CountryNotFoundError","l'identifiant passé en parametre " + countryParam + " ne correspond pas à une entrée du fichier");
    } else {//if found set the country name
      this.countryName = olympic.country;
      this.myLog.info("detail.ngOnInit : push 3 times...");
      tabNb.push(this.olympicService.countParticipations(olympic));
      tabNb.push(this.olympicService.getTotalMedals(olympic));    
      tabNb.push(this.olympicService.getTotalAthletes(olympic));
    }
  
    let participationTab: Participation[] = olympic?.participations;
    let yearsValues: Statistic[] = [];  //will contain the table of each year results
    this.lineData = new Array(0);       //will contain the number of medals for each year.
    //grab the numbers for the line chart
    participationTab?.forEach((p)=>{
      this.myLog.info("detail.ngOnInit lineData=" + olympic?.country + ' ' + p.year + ' ' + p.medalsCount);
      yearsValues.push({name: p.year.toString(),value: p.medalsCount});
    });
    this.lineData?.push({name: olympic.country,series: yearsValues});
  
    this.myLog.info("detail.ngOnInit tabNb.lenght=" + tabNb.length + ' : ' + tabNb[0] + ' ' + tabNb[1] + ' ' + tabNb[2]);
    this.getStat$ = new BehaviorSubject<number[]>(tabNb).pipe(
      take(1),
      tap(value=>this.myLog.info("detail.ngOnInit " + value.toString()))
    );

  }//ngOnInit

}
