import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { Institution } from 'src/app/shared/models/institution';
import { ApiService } from 'src/app/core/http/api.service';
/**
 * institution.service.ts
 * Contains Institutions
 * Subscribe to institutions$ to get data and changes
 * 30.10.2020
 */

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private institutionList: Institution[] = [];
  public institutions$ = new BehaviorSubject<Institution[]>(null);

  constructor(private apiService: ApiService) {}

  public getInstitutions(): Observable<Institution[]> {
    this.apiService
      .getInstitutions()
      .pipe(
        tap((institutions) => {
          this.load(institutions);
        })
      )
      .subscribe(
        (insts) => {
          // console.log('Institutions geladen');
        },
        (error) => {
          console.log('getInstitutions_Error:', error);
          let message = error; // Anpassen wenn nötig
          this.institutions$.error(message);
        }
      );
    return this.institutions$;
  }

  public storeInstitution(institution: Institution) {
    return this.apiService.postInstitution(institution).pipe(
      tap((savedInstitution) => {
        this.add(savedInstitution);
      })
    );
  }

  public updateInstitutions(institution: Institution): Observable<Institution> {
    return this.apiService.putInstitution(institution).pipe(
      tap((savedInstitution) => {
        this.edit(savedInstitution);
      })
    );
  }

  public deleteInstitution(institution: Institution) {
    return this.apiService.deleteInstitution(institution).pipe(
      tap((_) => {
        this.delete(institution);
      })
    );
  }

  // Store Handle
  ///////////////////////////////////////////

  private load(institutions: Institution[]) {
    this.institutionList = institutions;
    this.institutions$.next(this.institutionList);
  }

  private add(institution: Institution) {
    this.institutionList = [...this.institutionList, institution];
    this.institutions$.next(this.institutionList);
  }

  private edit(institution: Institution) {
    this.institutionList = this.institutionList.map((inst) => {
      const editedInstitution = institution;
      if (inst.id !== editedInstitution.id) {
        return inst;
      }
      return editedInstitution;
    });
    this.institutions$.next(this.institutionList);
  }

  private delete(institution: Institution) {
    this.institutionList = this.institutionList.filter(
      (inst) => inst.id !== institution.id
    );
    this.institutions$.next(this.institutionList);
  }
}
