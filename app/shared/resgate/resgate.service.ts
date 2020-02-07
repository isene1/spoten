import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from "../config";

@Injectable()
export class ResgateService {
    baseUrl = Config.apiUrl + "resgate/";

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
        console.log(error);
        console.log("APP LOG ERROR: " + JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    getRows(idEmp, idInbox) {
        return this.http.get(this.baseUrl + idEmp + "/" + idInbox, {
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

    postOnResgate(obj) {
        let row = {row: obj};
        let content = JSON.stringify(row);

        return this.http.post(this.baseUrl, content, {
            headers: this.getCommonHeaders()
        }).pipe (
            map((data: any) => {
                return data;
            }),
            catchError(this.handleErrors)
        );
    }
}