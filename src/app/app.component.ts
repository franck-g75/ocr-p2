import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
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
    private l: MyLoggingService
  ) {console.log('app appel du constructeur');}

  ngOnInit(): void {
    
    //l'idee : régler un booleen à true dans le service une fois que la lecture du fichier est complétée
    
    //console.log('app appel de loadInitialData()');
    this.l.info("app : appel de loadInitialData()");
    this.olympicService.loadInitialData().pipe(take(1)).subscribe({
      error: () => console.log("app : error subscribe"),
      complete: () => {
          //console.log('app : observable complete ');
          this.l.info("app : olympics complété");
          this.olympicService.setLoadComplete(true);
        }
    });
  }
}
 