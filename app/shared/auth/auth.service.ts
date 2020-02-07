import { Injectable } from "@angular/core";
// import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// import "rxjs/add/operator/catch";
// import "rxjs/add/operator/do";
// import { of } from 'rxjs/observable/of';
import { Auth } from './auth';
import { Config } from "../config";

// for template purposes
// import { MockAuth } from "./auth";


@Injectable()
export class AuthService {
    baseUrl = Config.apiUrl + "testeAuthSkel.php";
    idUrl = Config.apiUrl + "auth/";
    verificaUrl = Config.apiUrl + "verifica_user/?email=";

    constructor(private http: HttpClient) {
        // 
    }

    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    getCommonHeadersVerifica() {
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

    login(authObj) {
        return this.http.post<Auth>(this.baseUrl, {
            headers: this.getCommonHeaders(),
            Username: authObj.Username,
            Password: authObj.Password
        })
        .pipe(
            map((data: any) => {
                var allItems = new Auth();
                if (data.count == 0 || data.count > 1) {
                    throw("Forbidden");
                }
                allItems = data;
            }),
            catchError(this.handleErrors)
        );
    }

    verificaEmailCadastrado(email: string) {
        console.log("entrou no fauncao verifica");
        console.log(this.verificaUrl + email);
        return this.http.get(this.verificaUrl + email, {
            headers: this.getCommonHeadersVerifica()
        }).pipe(
            map((data: any) => {
                console.log(data.result);
                return data.result;
            }), 
            catchError(this.handleErrors)
        );
    }

    getHttpHeaders(){
        var guid = Config.returnUserToken();
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('bearer', guid);
        return headers;
    }

    setUserId(email){
        var data = {row:{email: email}};

        var content = JSON.stringify(data);

        return this.http.post(this.idUrl, content, { headers: this.getHttpHeaders() })
        .pipe(
            map((data: any) => {
                if(data.result != undefined){
                    Config.setUserId(data.result);
                }
            }),
            catchError(this.handleErrors)
        );

    }

    getUserId(){
        return Config.getUserId();
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