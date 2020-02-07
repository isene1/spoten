import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Config } from '../config';
import { Interesse } from './interesse';

@Injectable()
export class InteresseService {
    baseUrl = Config.apiUrl + "interesses/";

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
        // console.log(error);
        alert(error["error"].message);
        console.log("APP LOG ERROR: " + JSON.stringify(error));
        return Observable.throw(error);
    }

    getRows(id) {
        return this.http.get(this.baseUrl + id, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                var allItems = new Array<Interesse>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }
}