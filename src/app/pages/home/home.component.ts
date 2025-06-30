import { Component,  OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, take, } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  public olympics$: Observable<Olympic[] | null> = of(null);

  constructor(
    private olympicService: OlympicService,
    private l: MyLoggingService//4 lignes dans les logs
  ) { 
    //this.l = new MyLoggingService();
    //console.log("home.constructor(console)"); 
    //this.l.info("home.constructor (l)");//4 lignes
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    //le souci est que les chiffres arrivent après la creation de la page.
    //il faut faire un | async dans le template
    //Pour qu'il n'y ait pas d'erreur dans les logs il faut lire le booleen réglé (ou pas) à true 
    //les fonctions sont appelées 2 à 8 fois : il ne faut qu'un seul Observable

    //https://levio.ca/expertises/introduction-a-rxjs-dans-angular-observables-subjects-et-behaviorsubjects/
    //console.log("home.ngOnInit(console)");
    //this.l.info("home.ngOnInit(l)");
  }

  //Pour éviter d'appeler n fois l'observable : ne faire qu'une seule fonction qui retourne tout...
  //elle est en fait appelée n fois par le template n= 1 sans log, n=4 avec log
  getStat(): Observable<Number[]> {
    this.l.info('home.getStat : entering fct');
    const tabNb: number[] = [];
    //construction d'un tableau 
    if (this.olympicService.getLoadComplete()) {
      tabNb.push(this.olympicService.countNbJO());
      tabNb.push(this.olympicService.countNbCountries());    
    } else {
      tabNb.push(0);
      tabNb.push(0);
    }

    //console.log("home.getStat tabNb=" + tabNb.length + ' ' + tabNb[0] + ' ' + tabNb[1]);
    //s'affiche et multiplie par 4 le nb d'appel à getStat() quand le service log est actif
    this.l.info("tabNb=" + tabNb.length + ' ' + tabNb[0] + tabNb[1]);
    //s'affiche et multiplie par 4 (les memes 4 lignes du dessus ) le nb d'appel à getStat()
    return new BehaviorSubject<number[]>(tabNb).pipe(take(1));//,tap(value=>console.log(value)));
    //pas de souscription ??? c'est le async qui souscrit
  }
}
