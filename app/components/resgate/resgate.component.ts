import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Resgate } from "~/shared/resgate/resgate";
import { ResgateService } from "~/shared/resgate/resgate.service";
import { alert } from "tns-core-modules/ui/dialogs";

import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "resgate",
    providers: [
        ResgateService
    ],
    moduleId: module.id,
    templateUrl: "./resgate.component.html",
    styleUrls: ['./resgate.component.css']
})

export class ResgateComponent extends ClasseBase implements OnInit {

    estabResgate: Resgate = new Resgate();
    isLoading: boolean = false;
    paramEmpresa: number;
    paramInbox: number;

    listStar: number[];
    
    constructor(router: Router, private page: Page, 
        private resgateSvc: ResgateService, 
        private activRout: ActivatedRoute,
        private routerExtentions: RouterExtensions) {
            super(router);
            //
            this.estabResgate = new Resgate();
            this.isLoading = true;
            this.activRout.queryParams.subscribe(params => {
                this.paramEmpresa = params["idEmp"];
                this.paramInbox = params["idInbox"];

            });
            console.log(`o parametro passado foi ${this.paramEmpresa} e ${this.paramInbox}`);
    }

    ngOnInit() {
        this.getRows(this.paramEmpresa, this.paramInbox);
    }

    getRows(idEmp, idInbox) {
        this.isLoading = true;
        
        this.resgateSvc.getRows(idEmp, idInbox)
           .subscribe(
               (loadedRows) => {
                    if (loadedRows[0].nome_fantasia == undefined) {
                        loadedRows[0].nome_fantasia = "";
                    }
                    //console.log(loadedRows[0]);
                    this.estabResgate = loadedRows[0];
                    this.listStar = Array.from({length: loadedRows[0].avaliacaoGeral}, (value, key) => key + 1);
                    //console.log(`nome do estabelecimento  ${this.estabResgate.nome_fantasia}`);
                    this.isLoading = false;
               },
               () => {
                    // alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                    this.isLoading = false;
               }
        );
    }

    resgatar(codigo: string) {
        this.isLoading = true;

        if (!codigo) {
            let options = {
                title: "Código inválido",
                message: "Preencha o código!",
                okButtonText: "OK"
            };
            
            alert(options).then(() => {
                console.log("alert codigo vazio");
            });
            this.isLoading = false;
        } else {
            //console.log(`id inbox ${this.paramInbox} e codigo ${codigo}`);
            let output: JSON;
            let obj: any = {"inboxId": this.paramInbox, "redeemCode": codigo};
            output = <JSON> obj;
            this.resgateSvc.postOnResgate(output)
            .subscribe(
                (loadedRows) => {
                    let options = {
                        title: "Resgate realizado",
                        message: "Resgate realizado com sucesso!",
                        okButtonText: "OK"
                    };
                    
                    alert(options).then(() => {
                        console.log("resgate sucesso");
                    });
                    this.routerExtentions.navigate(["./inbox"], { clearHistory: true });
                }, (error) => {
                    this.isLoading = false;
                    let options = {
                        title: "Código inválido",
                        message: "Código de resgate não confere",
                        okButtonText: "OK"
                    };
                    
                    alert(options).then(() => {
                        console.log("resgate falhou");
                    });
                }
            )
        }
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
