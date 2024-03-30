// portfolio.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:3001/api/portfolio'; // Update with your actual backend API URL

  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Implement other methods for updating portfolio details as needed
}
