import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent, config } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from "../config";

@Injectable()
export class ConsumoService {
    urlEstabeleciemtos = Config.apiUrl + 'estabelecimentosconsumo/';

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

    getEstabelecimentos(lat, lon) {
        return this.http.get(this.urlEstabeleciemtos + lat + "/" + lon, {
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