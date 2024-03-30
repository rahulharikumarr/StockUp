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

  validateTicker(symbol: string): Observable<any> {
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
  getCompanyHistoricalDataLastWorkingDay(symbol: string): Observable<any> {
    // Construct the HTTP request URL
    const apiUrl = `${this.apiUrl}/historical?stockTicker=${symbol}`;
    // Fetch historical data for the last working day from your backend
    return this.http.get<any>(apiUrl);
  }

  getCompanyHistoricalDataLastTwoYears(symbol: string): Observable<any> {
    // Construct the HTTP request URL
    const apiUrl = `${this.apiUrl}/historical-last-two-years?stockTicker=${symbol}`;
    // Fetch historical data for the last two years from your backend
    return this.http.get<any>(apiUrl);
  }

  getInsiderSentiment(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insider-sentiment?symbol=${symbol}&from=2022-01-01`);
  }

  getEarnings(symbol: string): Observable<any> {
    const url = `${this.apiUrl}/earnings?symbol=${symbol}`;
    return this.http.get<any>(url);
  }

  getRecommendationTrends(symbol: string): Observable<any> {
    const url = `${this.apiUrl}/recommendation-trends?symbol=${symbol}`;
    return this.http.get<any>(url);
  }

  getCompanyNews(symbol: string): Observable<any> {
    const url = `${this.apiUrl}/company-news?symbol=${symbol}`;
    return this.http.get<any>(url);
  }
  
}
