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
  isLoading: boolean = false;

  constructor(private autoCompleteService: AutocompleteService) { } // Inject the service

  // Method to handle input change
  onInputChange() {
    this.isLoading = true;
    if (this.searchQuery.trim() !== '') {
      this.autoCompleteService.getAutocompleteSuggestions(this.searchQuery).subscribe(
        (data: any) => {
          //here we can use .filter to filter out according to what was mentioned - only using common stock and no '.' symbol
          this.suggestions = data.result.filter((suggestion: StockSuggestion) => {
            return suggestion.type === 'Common Stock' && !suggestion.symbol.includes('.');
          });
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } else {
      this.suggestions = [];
    }
  }
}
