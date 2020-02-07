import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { ObservableArray } from "tns-core-modules/data/observable-array";

import { PromocaoRelampago } from "../../shared/promocao-relampago/promocao-relampago";
import { PromocaoRelampagoService } from "../../shared/promocao-relampago/promocao-relampago.service";
import { AuthService } from "../../shared/auth/auth.service";
import { UpdateLocService } from '~/shared/update-loc/update-loc';
import { EmpresaClickService } from '~/shared/empresa-click/empresa-click';
const firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "em-alta",
    providers: [
        PromocaoRelampagoService,
        AuthService,
        UpdateLocService,
        EmpresaClickService
    ],
    moduleId: module.id,
    templateUrl: "./em-alta.component.html",
    styleUrls: ['./em-alta.component.css']
})


export class EmAltaComponent extends ClasseBase implements OnInit {
    dtRows: any;
    private dataEstabelecimentos: ObservableArray<PromocaoRelampago>;
    isLoading: boolean = false;
    latOrState: number;
    lonOrCity: number;
    userEmail: string = '';

    private atual: PromocaoRelampago;
    private indice: number;
    private timeSleep;

    constructor(
        router: Router, 
        private page: Page,
        private promocaoRelampagoService: PromocaoRelampagoService,
        private authSvc: AuthService,
        private activRout: ActivatedRoute,
        private routerExtentions: RouterExtensions,
        private updateLocSvc: UpdateLocService,
        private emprClickSvc: EmpresaClickService
    ) {
        super(router);
        this.dataEstabelecimentos = new ObservableArray<PromocaoRelampago>();
    }
    
    ngOnInit(): void {
        console.log(`id do usuario -> em_alta: ${this.authSvc.getUserId()["appuserId"]}`);
        this.isLoading = true;

        this.verifyGeoLocationEnabled();
        this.automatic();
    }

    // geolocalizacao
    verifyGeoLocationEnabled() {
        //
        isEnabled().then(
            (locationIsEnabled) => {
                if (locationIsEnabled != true) {
                    this.askForGeolocation();
                } else {
                    console.log("Servicos de localizacao habilitados");
                    this.isLoading = true;
                    // buscar localizacao
                    this.queryCurrentLocation();
                }
            }, 
            (notEnabled) => {
                console.log("disabled");
                // console.log("this code seems to never be reached");
            }
        );
    }

    askForGeolocation() {
        // enableLocationRequest(true);
        enableLocationRequest(true).then(
            (accepted) => {
                console.log("Aceito");
                this.queryCurrentLocation();
            },
            (rejected) => {
                console.log("Rejeitado");
                // 
            }
        );
    }

    queryCurrentLocation() {
        this.isLoading = true;
        getCurrentLocation({'desiredAccuracy': 3, 'updateDistance': 10, 'maximumAge': 20000, 'timeout': 20000}).then(
            (location) => {
                console.log("Buscou localizacao");
                console.log("Current location is: " + location.latitude + ", " + location.longitude);
                this.latOrState = location.latitude;
                this.lonOrCity = location.longitude;
                this.getRows();
                // update location on DB
                var aux = {
                    appuserId: this.authSvc.getUserId()["appuserId"],
                    latitude: this.latOrState,
                    longitude: this.lonOrCity
                }
                this.updateLocSvc.updateOnDb(aux)
                    .subscribe(
                        (loadedRows) => {
                            console.log("updated appuser location");
                        },
                        () => {
                            console.log("couldnt update appuser location");
                        }
                );
                //
            },
            (rejeitado) => {
                console.log("Nao conseguiu localizacao");
                alert("Não foi possível trazer sua localização");
                this.isLoading = false;
            }
        );
    }

    getRows() {
        this.dataEstabelecimentos = new ObservableArray<PromocaoRelampago>();
        this.isLoading = true;
        this.promocaoRelampagoService.getRows(this.latOrState, this.lonOrCity)
           .subscribe(
               (loadedRows) => {
                    this.dataEstabelecimentos = loadedRows;
                    this.isLoading = false;
                    this.indice = 0;
                    this.atual = this.dataEstabelecimentos[this.indice];
               },
               () => {
                alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }

    toLeft() {
        this.indice--;
        if (this.indice < 0) {
            this.indice = this.dataEstabelecimentos.length - 1;
            this.atual = this.dataEstabelecimentos[this.indice];
        } else {
            this.atual = this.dataEstabelecimentos[this.indice];
        }
    }

    toRigth() {
        this.indice++;
        if (this.indice > this.dataEstabelecimentos.length -1) {
            this.indice = 0;
            this.atual = this.dataEstabelecimentos[this.indice];
        } else {
            this.atual = this.dataEstabelecimentos[this.indice];
        }
    }

    private sleep(ms: number) {
        this.timeSleep = new Promise((resolve) => setTimeout(resolve, ms));
        return this.timeSleep;
    }

    private async automatic() {
        while (true) {
            this.indice++;
            if (this.indice > this.dataEstabelecimentos.length -1) {
                this.indice = 0;
                this.atual = this.dataEstabelecimentos[this.indice];
            } else {
                this.atual = this.dataEstabelecimentos[this.indice];
            }
            await this.sleep(5000);
        }
    }

    select() {
        console.log(`Clicou em ${this.atual.empresaId}`);
        // call empresa_clicks
        var aux = {
            empresaId: this.atual.empresaId,
            fonte_click: 'promocao_relampago'
        };
        this.emprClickSvc.postOnDb(aux)
            .subscribe(
                (loadedRows) => {
                    {};
                },
                () => {
                    {};
                }
        );
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "id": this.atual.empresaId,
            }
        };
        this.router.navigate(["./estabelecimento/"], navigationExtras);
    }

}
