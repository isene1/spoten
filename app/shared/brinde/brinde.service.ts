import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Brinde } from './brinde';
import { Config } from "../config";



@Injectable()
export class BrindeService {
    baseUrl = Config.apiUrl + "brinde_welcome/";
    urlVerifica = Config.apiUrl + "verifica_brinde/";

    constructor(private http: HttpClient) {
        // 
    }

    getCommonHeaders() {
        var guid = Config.returnUserToken();
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
	    headers = headers.append('bearer', guid);
        return headers;
    }

    handleErrors(error: Response) {
        console.log("APP LOG ERROR: " + JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    getRows(id, latOrState, lonOrCity) {
        return this.http.get(this.baseUrl + id + "/" + latOrState + "/" + lonOrCity, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                var allItems = new Array<Brinde>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }

    verificaBrinde(id) {
        return this.http.get(this.urlVerifica + id, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                var allItems = new Array<Brinde>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }
        
}