import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Sex } from './sex';
import { Config } from "../config";



@Injectable()
export class SexService {
    baseUrl = Config.apiUrl + "sex/";

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
        id = "-1";
        return this.http.get(this.baseUrl + id, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                var allItems = new Array<Sex>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }
        
}