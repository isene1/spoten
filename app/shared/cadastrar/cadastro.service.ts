import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cadastro } from './cadastro';
import { Config } from "../config";


@Injectable()
export class CadastroService {
    baseUrl = Config.apiUrl + "cadastro/";

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

    postOnDb(obj) {
        var row = {row: obj};
        var content = JSON.stringify(row);
        //
        return this.http.post(this.baseUrl, content, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.handleErrors)
        );
    }

    getUserInstagram(token: string) {
        return this.http.get("https://api.instagram.com/v1/users/self/?" + token)
            .pipe(
                map((data: any) => {
                    return data;
                }),
                catchError(this.handleErrors)
            )
    }

}
