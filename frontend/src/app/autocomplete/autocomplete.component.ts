import { Component } from '@angular/core';
import { AutocompleteService } from '../autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {
  searchQuery: string = '';
  suggestions: string[] = [];

  constructor(private autocompleteService: AutocompleteService) {}

  onInputChange(): void {
    this.autocompleteService.getAutocompleteSuggestions(this.searchQuery)
      .subscribe((suggestions: string[]) => {
        console.log(suggestions); // Log the response to check if suggestions are being received
        this.suggestions = suggestions;
      });
  }
  
}
