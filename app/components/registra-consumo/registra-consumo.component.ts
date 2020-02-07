import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { alert } from "tns-core-modules/ui/dialogs";
import { ClasseBase } from "~/shared/classeBase";
import { RouterExtensions } from "nativescript-angular/router";
import { RegistraConsumoService } from "~/shared/registra-consumo/registraConsumo.service"
import { AuthService } from "../../shared/auth/auth.service";

import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";

@Component({
    selector: "registra-consumo", 
    providers: [
        RegistraConsumoService,
        AuthService
    ],
    moduleId: module.id,
    templateUrl: "./registra-consumo.component.html",
    styleUrls: ['./registra-consumo.component.css']
})

export class RegistraConsumoComponent extends ClasseBase implements OnInit {
    
    isLoading = false;
    //consumo: Consumo = new Consumo();

    logo: string = '';
    
    empresaId: number;
    nome_fantasia: string;
    aval_01: number;
    aval_02: number;
    aval_03: number;
    aval_04: number;
    userId: number;
    
    constructor(        
        router: Router, 
        private page: Page,
        private activRout: ActivatedRoute,
        private registraConsumoSvc: RegistraConsumoService,
        private routerExtentions: RouterExtensions,
        private authSvc: AuthService
    ) {
        super(router);
        this.activRout.queryParams.subscribe(params => {
            this.empresaId = params["empresaId"];
            this.nome_fantasia = params["nome_fantasia"];
            this.aval_01 = params["aval_01"];
            this.aval_02 = params["aval_02"];
            this.aval_03 = params["aval_03"];
            this.aval_04 = params["aval_04"];
        });
        this.userId = this.authSvc.getUserId()["appuserId"];
    }

    ngOnInit() {
        if (!isAndroid) {
            return;
        }
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            if (this.router.isActive("/registra_consumo", false)) {
                data.cancel = true; // prevents default back button behavior
                this.back();
            }
        });
    }

    back() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "empresaId": this.empresaId,
            }
        };
        this.router.navigate(["./consumo/"], navigationExtras);
    }

    gerarConsumo(valor: number, cod: number) {
        console.log(`${valor} ${cod}`);
        this.isLoading = true;
        if(!cod || !valor ) {
            let options = {
                title: "Campo nulo",
                message: "Preencha todos os campos!",
                okButtonText: "OK"
            };
            
            alert(options).then(() => {
                console.log("alert codigo ou valor vazio");
            });
            this.isLoading = false;
        } else if(valor <= 0) {
            let options = {
                title: "Valor incorreto",
                message: "O valor deve ser maior do que zero!",
                okButtonText: "OK"
            };
            
            alert(options).then(() => {
                console.log("alert valor <= 0");
            });
            this.isLoading = false;
        } else {
            let output: JSON;
            let obj: any = {
                "valor": valor,
                "empresaId": this.empresaId,
                "appuserId": this.userId,
                "aval_01": this.aval_01,
                "aval_02": this.aval_02,
                "aval_03": this.aval_03,
                "aval_04": this.aval_04,
                "consumeCode": cod
            };
            output = <JSON> obj;
            console.log(output);
            this.registraConsumoSvc.postOnConsumo(output)
            .subscribe(
                (loadedRows) => {
                    let options = {
                        title: "Consumo realizado",
                        message: "Consumo realizado com sucesso!",
                        okButtonText: "OK"
                    };
                    
                    alert(options).then(() => {
                        console.log("consumo sucesso");
                    });
                    this.routerExtentions.navigate(["./em_alta"], { clearHistory: true });
                }, (error) => {
                    this.isLoading = false;
                    let options = {
                        title: "Código inválido",
                        message: "Código de consumo não confere",
                        okButtonText: "OK"
                    };
                    
                    alert(options).then(() => {
                        console.log("consumo falhou");
                    });
                }
            );
        }
    }
}