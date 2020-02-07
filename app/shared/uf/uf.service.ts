import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Uf } from './uf';
import { Config } from "../config";
import { ValueList } from "nativescript-drop-down";



@Injectable()
export class UfService {
    baseUrl = Config.apiUrl + "uf/";

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
                var allItems = new Array<Uf>();
                allItems = data.result;
                return allItems;
            }),
            catchError(this.handleErrors)
        );
    }        
}