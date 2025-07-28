import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { DetailedStatistic } from 'src/app/core/models/DetailedStatistic';
import { CountryIdNotNumericError } from 'src/app/core/models/errors/CountryIdNotNumericError';
import { CountryNotFoundError } from 'src/app/core/models/errors/CountryNotFoundError';
import { Olympic } from 'src/app/core/models/Olympic';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  //public olympics$: Observable<Olympic[] | null> = of(null);
  public getStat$: Observable<Number[] | null> = of(null); 
  public countryName: string | null = null; 
  public lineData: DetailedStatistic[] | null = null; // datas of the line chart
  private olympic: Olympic | undefined ; //an object olympic to contain the country
  private countryParam: string = this.route.snapshot.queryParamMap.get('country')??"-1";
  constructor(
      private olympicService: OlympicService,
      private myLog: MyLoggingService
    ) { }

  ngOnInit(): void {
    this.myLog.info("detail.ngOnInit...");
    
    //let tabNb: number[] = [];         //a tab that will contain 3 numbers to write below the title


    this.olympicService.getOlympics()
          .pipe(tap(val => this.myLog.info("detail.tap..." + val)),takeUntil(this.destroy$))
          .subscribe(value => {

          //this part of code is read 2 times 
          //-the first time at the beginning where value is null
          //-the second time value = Olympic[]
          if (value != null){

            
            
            /**
             * get the olympic object with the url parameter
             */
            this.myLog.info("detail.ngOnInit  countryParam = |" + this.countryParam + "|");
            if (!Number.isInteger(parseInt(this.countryParam))){
              throw new CountryIdNotNumericError("CountryIdNotNumericError","l'identifiant " + this.countryParam + " passé en parametre n'est pas numeric");
            } else {//the number in the query paramter is really a number

              //find the olympic in the olympic table
              this.olympic=value?.find(val => val.id === parseInt(this.countryParam));
            
              //check if the olympic object is found
              if (this.olympic == undefined){//not found send an error
                throw new CountryNotFoundError("CountryNotFoundError","l'identifiant passé en parametre " + this.countryParam + " ne correspond pas à une entrée du fichier");
              } else {
                this.countryName = this.olympic.country;//if found set the country name
                //get the numbers below the title
                this.getStat$=this.olympicService.getTopStatDetail(this.olympic);
                //get lineChartValues
                this.lineData=this.olympicService.getLineChartValues(this.olympic); 
              }// if olympic is not null
              
            }//else (the number in the query paramter is really a number)
          }//if value is not null
      });//subscribe
    }//ngOnInit


/**
 * 
 */
ngOnDestroy() {
  this.myLog.debug("Detail.ngOnDestroy...");
  this.destroy$.unsubscribe(); //mentor code
  //this.destroy$.next();      //internet found
  //this.destroy$.complete();  //internet found
}
}
