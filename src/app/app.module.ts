// ie 11 bug fix : https://stackoverflow.com/questions/45353619/angular4-application-running-issues-in-ie11

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { AppComponent } from './app.component';
import { ExchangeRateComponent } from './calculator/exchange-rate/exchange-rate.component';


@NgModule({
  declarations: [
    AppComponent,
    ExchangeRateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
