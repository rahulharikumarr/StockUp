import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HomeComponent } from './home/home.component'; // Import HomeComponent here
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    HomeComponent // Add HomeComponent here
    // Other components, directives, and pipes
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
    // Other modules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
