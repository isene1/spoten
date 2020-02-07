import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Config } from "~/shared/config";
import { Cashback } from "./cashback";

@Injectable()
export class CashbackService {

    private baseUrl = Config.apiUrl + "cashback/";

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
                var allItems = new Array<Cashback>();
                allItems = data.result;
                return allItems;                
            }),
            catchError(this.handleErrors)
        );
    }

    toInbox(obj) {
        return this.http.patch(this.baseUrl, obj, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                console.log(`retorno ${data}`);
                return data;
            }),
            catchError(this.handleErrors)
        );
    }
}