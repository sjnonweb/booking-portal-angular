import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FacilityBookingData } from './in-memory-web-api';

import { AppComponent }  from './app.component';
import { BookingService } from './app.service';

@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(FacilityBookingData, {passThruUnknownUrl: true})
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
    BookingService
  ]
})
export class AppModule { }
