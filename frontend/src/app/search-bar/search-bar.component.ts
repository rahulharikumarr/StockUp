import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteService } from '../autocomplete.service'; // Update the path
import { StockDataService } from '../search.service'; // Update the path
import { SearchResultService } from '../search-results.service';
import { Location } from '@angular/common';


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
  @Output() validTicker = new EventEmitter<boolean>();
  @Output() clearClicked = new EventEmitter<void>();
  faMagnifyingGlass = faMagnifyingGlass;
  searchQuery: string = ''; // Add searchQuery property
  suggestions: StockSuggestion[] = [];
  isLoading: boolean = false;

  @Output() clear = new EventEmitter<void>();

  constructor(
    private autoCompleteService: AutocompleteService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private stockDataService: StockDataService,
    private searchResultService: SearchResultService
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
// Method to perform search and navigate to search/:ticker route
search() {
  if (this.searchQuery.trim() !== '') {
    this.stockDataService.validateTicker(this.searchQuery.trim()).subscribe(
      data => {
        if (Object.keys(data).length === 0) { // Check if the response data is an empty object
          this.validTicker.emit(false);
        } else {
          this.validTicker.emit(true);
          // Redirect to search results page with the entered ticker symbol
          this.router.navigate(['/search', this.searchQuery.trim()]);
          this.searchResultService.setLastSearchedTicker(this.searchQuery.trim());
        }
      },
      error => {
        console.error(error);
        this.validTicker.emit(false);
      }
    );
  }
}



clearSearch() {
  this.searchQuery = '';
  this.clear.emit();
  this.clearClicked.emit();
}

  navigateToSymbol(displaySymbol: string): void {
    this.router.navigate(['/search', displaySymbol.trim()]);
  }
}