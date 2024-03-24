import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchResultService {
  private searchResultsMap: Map<string, any> = new Map<string, any>();
  private lastSearchedTicker: string = '';

  constructor() {}

  storeSearchResults(ticker: string, data: any): void {
    this.searchResultsMap.set(ticker, data);
  }

  getSearchResults(ticker: string): any {
    return this.searchResultsMap.get(ticker);
  }

  clearSearchResults(ticker: string): void {
    this.searchResultsMap.delete(ticker);
  }

  clearAllSearchResults(): void {
    this.searchResultsMap.clear();
  }

  getLastSearchedTicker(): string {
    return this.lastSearchedTicker;
  }

  setLastSearchedTicker(ticker: string): void {
    if (ticker && ticker.trim() !== '') {
      this.lastSearchedTicker = ticker;
    }
  }
}
