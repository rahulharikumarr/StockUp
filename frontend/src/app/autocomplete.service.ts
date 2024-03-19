// autocomplete.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private apiUrl: string = 'http://localhost:3001/api/stocks/autocomplete';

  constructor(private http: HttpClient) {}

  getAutocompleteSuggestions(query: string): Observable<string[]> {
    const url: string = `${this.apiUrl}?query=${query}`;
    return this.http.get<string[]>(url);
  }
}
