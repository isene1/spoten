import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Config } from "~/shared/config";

@Injectable()
export class PerfilService {
    baseUrl = Config.apiUrl + "perfil/";

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

    getRows(user: number) {
        return this.http.get(this.baseUrl + user, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                return data.result;
            }),
            catchError(this.handleErrors)
        );
    }

    altRow(user: number, obj: object) {
        return this.http.patch(this.baseUrl + user, obj, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                // console.log(`retorno ${data}`);
                return data;
            }),
            catchError(this.handleErrors)
        );
    }
}