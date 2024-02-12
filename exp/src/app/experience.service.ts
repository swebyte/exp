import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExperienceDto } from './models/experiencedto';
import { Observable, concatMap,from, of, switchMap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private http: HttpClient) { }

  getExperiences(): Observable<ExperienceDto[]> {
    return this.http.get<ExperienceDto[]>('assets/db/experiences.json').pipe(
      concatMap(experiences => from(experiences)),
      concatMap(experience => {
        return this.getHtmlContent(experience.contentHtml).pipe( 
          switchMap(result => {
            experience.contentHtml = result;
            return of(experience);
          })
        );
      }),
      toArray()
    );
  }

  private getHtmlContent(fileName: string) {
    return this.http.get('assets/db/' + fileName, { responseType: 'text' });
  }
}
