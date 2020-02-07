import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cidade } from './cidade';
import { Config } from "../config";



@Injectable()
export class CidadeService {
    baseUrl = Config.apiUrl + "cidade/";

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

    getRows(id) {
        return this.http.get(this.baseUrl + id, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                var allItems = new Array<Cidade>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }
        
}