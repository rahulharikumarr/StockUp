import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteService } from '../autocomplete.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faX = faX;
  searchQuery: string = '';
  suggestions: string[] = [];

  constructor(private autocompleteService: AutocompleteService) {}

  onInputChange(): void {
    this.autocompleteService.getAutocompleteSuggestions(this.searchQuery)
      .subscribe((suggestions: string[]) => {
        this.suggestions = suggestions;
      });
  }
}


