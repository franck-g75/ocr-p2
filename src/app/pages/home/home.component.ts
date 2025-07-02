import { Component,  OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, take, } from 'rxjs';
import { MedalStat } from 'src/app/core/models/MedalStat';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
import { PieLabelComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  public olympics$: Observable<Olympic[] | null> = of(null);
  public getStat$: Observable<Number[] | null> = of(null);
  public pieDataCalc: MedalStat[] | null = null;

  colorScheme = {
    domain: ['#5AA454', '#000000', '#C7B42C']
  };

  constructor(
    private olympicService: OlympicService,
    private l: MyLoggingService
  ) { 
    
  }

  ngOnInit(): void {

    this.l.info("home ngOnInit ");

    this.olympics$ = this.olympicService.getOlympics();

    //https://levio.ca/expertises/introduction-a-rxjs-dans-angular-observables-subjects-et-behaviorsubjects/
    //console.log("home.ngOnInit(console)");
    //this.l.info("home.ngOnInit(l)");

    this.olympicService.loadInitialData().pipe(take(1)).subscribe({
      error: () => this.l.error("app : error subscribe"),
      complete: () => {
          //console.log('app : observable complete ');
          this.l.info("app : olympics complété");
          //this.olympicService.setLoadComplete(true);
          const tabNb: number[] = [];
          //construction d'un tableau 
          tabNb.push(this.olympicService.countNbJO());
          tabNb.push(this.olympicService.countNbCountries());    
          
          this.l.info("home ngOnInit tabNb=" + tabNb.length + ' ' + tabNb[0] + tabNb[1]);
          this.getStat$ = new BehaviorSubject<number[]>(tabNb).pipe(take(1));//,tap(value=>console.log(value)));

          let olympicList: Olympic[] | null = [];
          this.olympicService.getOlympics().subscribe(data => {
            olympicList = data;
          });
          let nbTotalMedals: number = 0;
          this.pieDataCalc = new Array(0);
          //grab the numbers
          olympicList?.forEach((o)=>{
            this.l.info("pieDataCalc=" + o.country + ' ' + this.olympicService.getTotalMedals(o) ) ;
            let medalStat: MedalStat = {name: o.country,value: this.olympicService.getTotalMedals(o)};
            nbTotalMedals += this.olympicService.getTotalMedals(o);
            this.pieDataCalc?.push(medalStat);
          });
        } //complete
    });//subscribe
  }//ngOnInit

  


setLabelFormatting(c: PieLabelComponent): string {
  return `
    <div style="display: flex; align-items: center;" class="tooltip">
      <span>${c.label}</span>
      <div style="flex: 1; height: 1px; background-color: #000; margin-left: 8px;"></div>
    </div>
  `;
}


labelFormatting(name: string) { // this name will contain the name you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x: MedalStat) => x.name == name); // chartData will be present in
                                                        // series along with the label
    if(data.length > 0) {
      return `<hr>${data[0].name}`;
    } else {
      return name;
    }
  }



alerter(pCountry: string){
  this.l.info("country = " + pCountry);
  alert("The country is : " + pCountry);
}


} // class
