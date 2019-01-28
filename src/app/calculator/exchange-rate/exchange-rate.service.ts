import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Currency } from './currency';
import { ExchangeRateServiceResult } from './exchangeRateServiceResult';

import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ExchangeRateService {

    private readonly rateUrl = 'https://api.exchangeratesapi.io/latest';
    private readonly currencyDetailFilePath = '/assets/Common-Currency.json';

    constructor(private http: HttpClient) { }
    
    getCurrencies() : Observable<Currency[]> {

        var serviceResult = this.http.get<ExchangeRateServiceResult>(this.rateUrl);
        var currencyDetails = this.http.get(this.currencyDetailFilePath);

        return forkJoin([serviceResult, currencyDetails])
            .pipe(
                map(data => 
                    this.sortCurrencies(                        
                        this.createCurrencies(
                            this.addBaseCurrency(data[0]), data[1]
                        )
                    )
                )
            );
    }

    // api result rates does not contain base currency
    // check and add base currency
    private addBaseCurrency(serviceResult : ExchangeRateServiceResult) : ExchangeRateServiceResult {
        var rates = serviceResult.rates;

        if(rates[serviceResult.base] === undefined) {
            rates[serviceResult.base] = serviceResult.base;
        }
        return serviceResult;
    }

    private createCurrencies(serviceResult : ExchangeRateServiceResult, currencyDetails: any) : Currency[] {            
        // new currency object creation; code from api, name from internal json file
        var currencies: Currency[] = [];
        var currencyDetail;

        for(var key in serviceResult.rates) {
            currencyDetail = currencyDetails[key];
            currencies.push({
                code : key,
                name : currencyDetail.name
            });
        }
        
        return currencies;         
    }

    private sortCurrencies(currencies : Currency[]): Currency[] {  
        return currencies.sort((a,b) => (a.name > b.name) ? 1 : -1);
    }

    getRate(fromCurrency: string, toCurrency: string) : Observable<number> {
        var url = this.rateUrl + '?base=' + fromCurrency + '&symbols=' + toCurrency;
        return this.http.get<ExchangeRateServiceResult>(url)
            .pipe(
                map(data => data.rates[toCurrency])
            );
    }
}