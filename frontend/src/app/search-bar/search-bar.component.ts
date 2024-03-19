import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteService } from '../autocomplete.service'; // Update the path

interface StockSuggestion {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faX = faX;
  searchQuery: string = '';
  suggestions: StockSuggestion[] = [];

  constructor(private autoCompleteService: AutocompleteService) { } // Inject the service

  // Method to handle input change
  onInputChange() {
    if (this.searchQuery.trim() !== '') {
      this.autoCompleteService.getAutocompleteSuggestions(this.searchQuery).subscribe(
        (data: any) => {
          this.suggestions = data.result;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.suggestions = [];
    }
  }
}
