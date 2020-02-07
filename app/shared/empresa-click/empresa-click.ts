import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Config } from "~/shared/config";

@Injectable()
export class EmpresaClickService {
    baseUrl = Config.apiUrl + "empresa_click/";

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

    postOnDb(aux) {
        // aux should contain: empresaId, userId, fonte_click
        aux.userId = Config.getUserId()["appuserId"];
        return this.http.post(this.baseUrl, aux, {
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