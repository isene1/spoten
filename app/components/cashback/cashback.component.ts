import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { RouterExtensions } from "nativescript-angular/router";

import { Cashback } from "./cashback";
import { CashbackService } from "./cashback.service";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
    selector: "cashback",
    providers: [
        CashbackService,
        AuthService
    ],
    moduleId: module.id,
    templateUrl: "./cashback.component.html",
    styleUrls: ['./cashback.component.css']
})


export class CashbackComponent extends ClasseBase implements OnInit {
    
    cashbackLst = new Array<Cashback>();
    isLoading: boolean = true;
    userId: number;
    
    constructor(
        router: Router, 
        private page: Page,
        private cashbackSvc: CashbackService,
        private routerExtentions: RouterExtensions,
        private authSvc: AuthService
        ) 
    {
        super(router);
        this.userId = this.authSvc.getUserId()["appuserId"];
    }

    ngOnInit(): void {
        this.getCashback(this.userId); // id cliente estatico para teste
        //this.isLoading = false;
    }

    getCashback(clienteId) {
        this.cashbackSvc.getRows(clienteId)
            .subscribe(
                (loadedRows) => {
                    loadedRows.forEach(element => {
                        this.cashbackLst.push(element);
                        //console.log(element);
                    });
                    this.isLoading = false;
                },
                () => {
                    this.cashbackLst.push();
                    alert("Não foi possível carregar a lista de Cashbacks");
                }
            );
    }

    progressbar(item) {
        return "progressbar-value" + item.nivelRank;
    }

    setProgressbarWidth(percent) {
        return percent + "*," + (100 - percent) + "*";
    }

    descricao_nome(item) {
        if(item.nome_fantasia.length > 35)
            return item.nome_fantasia.substr(0,35) + "...";
        else 
            return item.nome_fantasia;
    }

    descricao_spots(item) {
        return "$ " + item.valor;
    }

    itemTap(item) {
        if(item.percentComplete == 100) {
            let output: JSON;
            let obj: any = {
                "row": {
                    "toImbox": 1,
                    "cashbackId": item.cashbackId
                } 
            };
            output = <JSON> obj;
            console.log(output);
            this.cashbackSvc.toInbox(output)
            .subscribe((loadedRows) => {
                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        "appuserId": 1,
                    }
                };
                this.routerExtentions.navigate(["./inbox"], { clearHistory: true });
            })
        }
        else {
            return;
        }
    }
}
