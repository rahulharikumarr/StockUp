// watchlist.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:3001/api/watchlist'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  getWatchlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToWatchlist(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  removeFromWatchlist(itemTicker: string): Observable<any> {
    // Encode the ticker value
    const encodedTicker = encodeURIComponent(itemTicker);
    // Construct the URL with the encoded ticker value
    const url = `${this.apiUrl}/${encodedTicker}`;
    // Send the delete request
    return this.http.delete<any>(url);
  }
}
