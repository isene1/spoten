import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from "~/shared/config"

@Injectable()
export class BuscaService {
    baseUrl = Config.apiUrl + "search?search=";

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

    getRows(searchPhrase) {
        return this.http.get(this.baseUrl + searchPhrase, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                //console.log(data.result);
                return data.result;
            }),
            catchError(this.handleErrors)
        );
    }
        
}