import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private apiUrl = 'http://localhost:3001/api/stocks';
  private searchQuery: string = '';

  constructor(private http: HttpClient) { }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  // Method to search for stocks
  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`);
  }

  // Method to get company data
  getCompanyData(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile?symbol=${symbol}`);
  }

  // Method to get market status
  getMarketStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/market-status?exchange=US`);
  }

  // Method to get latest price
  getLatestPrice(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest-price?symbol=${symbol}`);
  }

  // Method to get company peers
  getCompanyPeers(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/peers?symbol=${symbol}`);
  }

  // Method to get company historical data
  getCompanyHistoricalData(symbol: string): Observable<any> {
    // Implement the logic to fetch historical data
    // You may need to provide additional parameters such as from date and to date
    return this.http.get<any>(`${this.apiUrl}/historical?stockTicker=${symbol}`);
  }
}
