import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  private loadComplete: boolean = false;

  constructor(
    private http: HttpClient,
    private l: MyLoggingService
  ) {

  }

  //chargement des données 
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap(value => {
        this.l.info("olymic.Service : lecture du fichier en cours... ")
        this.olympics$.next(value);
        console.log(value);
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        alert('Erreur rencontrée' + error);
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);//todo
        return caught;
      })
    );
  }

  // Méthode pour convertir le BehaviorSubject en un Observable disponible en lecture seule.
  // Cela permet aux composants de s'y abonner SANS modifier les données.
  getOlympics() {
    return this.olympics$.asObservable();
  }

  //permet de savoir si le loading est complet (les données sont bien dans le tableau)
  getLoadComplete() : boolean {
    return this.loadComplete;
  }

  //permet de définir que le loading est complet (les données sont bien dans le tableau)
  setLoadComplete(pComplete: boolean): void {
    this.loadComplete = pComplete;
  }
  
  // Méthode pour compter le nombre de pays participants aux JO
  countNbCountries(): number {
    const oc = this.getOlympicsValue();
    return oc ? oc.length : 0;
  }

  // Méthode pour compter le nombre de JO diferents
  countNbJO(): number {
    const ov = this.getOlympicsValue();//OlympicValue
    const oy: number[] = [0];//olympic year
    ov.forEach(o => {
      o.participations.forEach(p => {
        if (oy.indexOf(p.year)==-1){
          oy.push(p.year); 
        }
      });
    });
    return oy ? oy.length-1 : 0;
  }

  // Méthode pour compter le nombre de fois où un pays a participé aux JO
  countParticipations(): number {
    const olympics = this.getOlympicsValue();
    return (olympics && olympics[0].participations) ? olympics[0].participations.length : 0;
  }

  // Méthode pour trouver l'instance Olympic correspondant à un pays donné
  getOlympicByName(name: string): Olympic | undefined {
    const olympics = this.getOlympicsValue();

    if (!olympics) {
      throw new Error('No olympics data available!');
    }

    const foundOlympic = olympics.find(olympic => olympic.country === name);

    if (!foundOlympic) {
      throw new Error('Olympic not found!');
    }

    return foundOlympic;
  }

  // Méthode pour avoir le nombre total de médailles remportées par un pays
  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  // Méthode pour avoir le nombre total d'athlètes par pays
  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
  }

  // Méthode pour récupérer la valeur du BehaviorSubject et retourner un tableau d'objets Olympic
  private getOlympicsValue(): Olympic[] {
    const olympics = this.olympics$.getValue();
    if (!olympics) {
      throw new Error('No olympics data available!');
    }
    return olympics;
  }
}
