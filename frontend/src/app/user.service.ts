import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api/user';

  constructor(private http: HttpClient) {}

  getWalletBalance(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/balance`).pipe(
      map(response => response.balance)
    );
  }

  buyStock(ticker: string, quantity: number, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy`, { ticker, quantity, price });
  }
  
  sellStock(ticker: string, quantity: number, currentPrice: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sell`, { ticker, quantity, currentPrice });
  }
  
  getUserStocksQuantity(ticker: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/stocks/${ticker}`).pipe(
      map(response => response.quantity)
    );
  }

  getPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolio`);
  }
}
