import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { MyLoggingService } from 'src/app/core/services/my.loging.service';
import { CountryNotFoundError } from '../models/errors/CountryNotFoundError';
import { NoOlympicDataAvailableError } from '../models/errors/NoOlympicDataAvailableError';
import { StartAtOneError } from '../models/errors/StartAtOneError';
import { EmptyFileFoundError } from '../models/errors/EmptyFileFoundError';
import { EmptyTableFoundError } from '../models/errors/EmptyTableFoundError';
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private start: number = 0;// if the table in the file starts with id = 1 then 1 else 0  
  constructor(
    private http: HttpClient,
    private myLog: MyLoggingService
  ) { }

  //chargement des données
  /**
   * data loading
   * @returns void
   */ 
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap(value => {
        this.myLog.debug("olypmic.service : lecture du fichier en cours... ")
        this.olympics$.next(value);
        if (!(value instanceof Array)){
          throw new EmptyFileFoundError('EmptyFileFoundError','The file is completely empty');
        }
        if (value.length==0){
          throw new EmptyTableFoundError('EmptyFileFoundError','The table in the file is empty');
        } else {
          this.start=value[0].id;
          if (this.start==1){
            throw new StartAtOneError("StartAtOneError","The ids of the file start at 1 not zero");
          }
        }
        
        console.log(value);//write the entire table ine the log...
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        if (error instanceof StartAtOneError){
          throw new StartAtOneError("StartAtOneError","The ids of the file start at 1 not zero");
        } else if (error instanceof EmptyFileFoundError) {
          throw new EmptyFileFoundError('EmptyFileFoundError','The file is completely empty');
        } else if (error instanceof EmptyTableFoundError) {
          throw new EmptyFileFoundError('EmptyFileFoundError','The table in the file is empty');
        } else {
          throw new NoOlympicDataAvailableError('NoOlympicDataAvailableError','Sorry file Not found');
        }
        
        //alert('Erreur rencontrée' + error);
        //console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        //this.olympics$.next(null);//todo
        //return caught;
      })
    );
  }

  // Méthode pour convertir le BehaviorSubject en un Observable disponible en lecture seule.
  // Cela permet aux composants de s'y abonner SANS modifier les données.
  getOlympics() {
    return this.olympics$.asObservable();
  }

  
  

  /**
   * 
   * @returns the number of different countries in the file
   */
  countNbCountries(): number {
    const oc = this.getOlympicsValue();
    return oc ? oc.length : 0;
  }


  
  /**
   * 
   * @returns The number of different JO in the file
   */
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

  
  /**
   * 
   * @param name 
   * @returns the olympic object whitch have the same name of parameter
   */
  getOlympicByName(name: string): Olympic | undefined {
    const olympics = this.getOlympicsValue();

    if (!olympics) {
      throw new NoOlympicDataAvailableError('NoOlympicDataAvailableError','No olympics data available');
    }

    const foundOlympic = olympics.find(olympic => olympic.country === name);

    if (!foundOlympic) {
      throw new CountryNotFoundError('CountryNotFoundError','Olympic not found');
    }

    return foundOlympic;
  }

  /**
   * 
   * @param id 
   * @returns the olympic object whith the same id in the parameter
   */
  getOlympicById(id: number): Olympic {
    const olympics = this.getOlympicsValue();

    if (!olympics) {
      throw new NoOlympicDataAvailableError('NoOlympicDataAvailableError','No olympics data available');
    }

    const foundOlympic = olympics.find(olympic => olympic.id === id);

    if (!foundOlympic) {
      throw new CountryNotFoundError('CountryNotFoundError','Olympic not found');
    }

    return foundOlympic;
  }

  /**
   * PBM : with id starting at id = 1 : solved
   * @param olympic the olympic instance
   * @returns number of JO country participation
   */
  countParticipations(olympic: Olympic): number {
    const olympics = this.getOlympicsValue();
    return (olympics && olympics[olympic.id-this.start].participations) ? olympics[olympic.id-this.start].participations.length : 0;
  }

  /**
   * @param olympic : the olympic instance
   * @returns number of medals won by the country of the olympic instance parameter
   */
  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
  }

  /**
   * 
   * @param olympic 
   * @returns total number of athletes
   */
  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
  }

  /**
   * private method 
   * @returns the olympic table if loaded else returns an error 
   */
  private getOlympicsValue(): Olympic[] {
    const olympics = this.olympics$.getValue();
    if (!olympics) {
      throw new NoOlympicDataAvailableError('NoOlympicDataAvailableError','No olympics data available');
    }
    return olympics;
  }
}
