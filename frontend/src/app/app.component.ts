import { Component } from '@angular/core';
import { SearchResultService } from './search-results.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public searchResultService: SearchResultService) {}

  getSearchLink(): string {
    const lastSearchedTicker = this.searchResultService.getLastSearchedTicker();
    if (lastSearchedTicker) {
      return '/search/' + lastSearchedTicker;
    } else {
      // If no last searched ticker is available, fallback to the default search route
      return '/search';
    }
  }
}
