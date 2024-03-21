import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
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
export class SearchBarComponent implements OnInit {
  @Input() query: string = ''; // Declare query as an input property
  faMagnifyingGlass = faMagnifyingGlass;
  searchQuery: string = ''; // Add searchQuery property
  suggestions: StockSuggestion[] = [];
  isLoading: boolean = false;

  constructor(
    private autoCompleteService: AutocompleteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if the route contains a ticker symbol
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      if (ticker) {
        // Update searchQuery with ticker if available
        this.searchQuery = ticker;
      }
    });
  }

  // Method to handle input change
  onInputChange() {
    this.isLoading = true;
    if (this.searchQuery.trim() !== '') { // Use searchQuery instead of query
      this.autoCompleteService.getAutocompleteSuggestions(this.searchQuery).subscribe(
        (data: any) => {
          // Filter suggestions based on criteria
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

  // Method to perform search and navigate to search/:ticker route
  search() {
    if (this.searchQuery.trim() !== '') { // Use searchQuery instead of query
      // Redirect to search results page with the entered ticker symbol
      this.router.navigate(['/search', this.searchQuery.trim()]);
    }
  }

  navigateToSymbol(displaySymbol: string): void {
    this.router.navigate(['/search', displaySymbol.trim()]);
  }
}
