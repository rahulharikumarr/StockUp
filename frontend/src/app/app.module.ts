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

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // Add this line to import FormsModule
    FontAwesomeModule
  ],
  providers: [AutocompleteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
