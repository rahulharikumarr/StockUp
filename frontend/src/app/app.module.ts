import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Add this line to import FormsModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HomeComponent } from './home/home.component'; 
import { AutocompleteComponent } from './autocomplete/autocomplete.component'; // Add this line to import AutocompleteComponent
import { AutocompleteService } from './autocomplete.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { SearchResultService } from './search-results.service';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StockDataService } from './search.service';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent,
    AutocompleteComponent,
    SearchDetailsComponent,
    TabGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // Add this line to import FormsModule
    FontAwesomeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [AutocompleteService, provideAnimationsAsync(), SearchResultService, StockDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }