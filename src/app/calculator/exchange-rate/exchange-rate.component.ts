import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ExchangeRateService } from './exchange-rate.service';
import { Currency } from './currency';


@Component({
    selector: 'exchange-rate-calculator',
    templateUrl: './exchange-rate.component.html'
})

export class ExchangeRateComponent implements OnInit {
        
    currencies: Currency[];    
    fromCurrency: string = null;
    toCurrency: string = null;
    exchangeRate: string;

    constructor(private exchangeRateService : ExchangeRateService, private decimalPipe: DecimalPipe) {}

    ngOnInit() {
        this.getCurrencies();
    }

    getCurrencies() {
        this.exchangeRateService.getCurrencies()
            .subscribe(currencies => this.currencies = currencies);
    }
      
    currencyChange() {
        if(this.fromCurrency && this.toCurrency) {
            if(this.fromCurrency == this.toCurrency) {
                this.exchangeRate = "1";
            } else {
                this.exchangeRate = "Loading...";
                this.exchangeRateService.getRate(this.fromCurrency, this.toCurrency)
                    .subscribe(rate => this.setExchangeRate(rate));
            }
        }
    }

    setExchangeRate(rate: number) {
        this.exchangeRate = this.decimalPipe.transform(rate, '1.4-4');        
    }
}