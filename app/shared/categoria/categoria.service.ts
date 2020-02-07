import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from "../config";

@Injectable()
export class CategoriaService {
    baseUrl = Config.apiUrl + "categories/";
    urlCat = Config.apiUrl + "estabelecimentoscategorias/";
    urlInicial = Config.apiUrl + "estabelecimentosconsumo/";

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

    getRows() {
        return this.http.get(this.baseUrl + -1, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                return data.result;
            }),
            catchError(this.handleErrors)
        );
    }

    getEstabelecimentos(lat, lon, cat, fil) {
        return this.http.get(this.urlCat + lat + "/" + lon + "/" + cat + "/" + fil, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                return data.result;
            }),
            catchError(this.handleErrors)
        );
    }

    getEstabelecimentosInicial(lat, lon) {
        return this.http.get(this.urlInicial + lat + "/" + lon, {
            headers: this.getCommonHeaders()
        })
        .pipe(
            map((data: any) => {
                return data.result;
            }),
            catchError(this.handleErrors)
        );
    }
}