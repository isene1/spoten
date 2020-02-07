import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import * as geolocation from "nativescript-geolocation";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { Cadastro } from '~/shared/cadastrar/cadastro';
import { Brinde } from "~/shared/brinde/brinde";
import { BrindeService } from "~/shared/brinde/brinde.service";

@Component({
    selector: "welcome",
    providers: [
        BrindeService
    ],
    moduleId: module.id,
    templateUrl: "./welcome.component.html",
    styleUrls: ['welcome.css'],
})


export class WelcomeComponent extends ClasseBase implements OnInit {

    isLoading: boolean = false;
    brindeLst: Array<Brinde> = [];
    lat: number = null;
    lon: number = null;
    estado: number = null;
    cidade: number = null;
    flagLocation: boolean = false;
    isca: number = null;
    modo: number;
    
    constructor(router: Router,
        private activRout: ActivatedRoute,
        private page: Page,
        private brindeSvc: BrindeService) {
            //
            super(router);
            
            // escolheu cidade manualmente
            this.activRout.queryParams.subscribe(params => {
                this.estado = params["estadoId"];
                this.cidade = params["cidadeId"];

                console.log("CIDADE: " + this.cidade);
                
                if (this.cidade != undefined || this.cidade != null) {
                    this.modo = -2;
                    this.flagLocation = false;
                    this.getBrindes(-2, this.estado, this.cidade);
                }
            });
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        
        // if cidadeId is set, it means user got here from choice-city and don want the locale active
        if (this.cidade == undefined || this.cidade == null) {
            this.verifyGeoLocationEnabled();
        } else {
            // carregar iscas
        }
        
    }

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
                this.navigate('/choice_city');
            }
        );
    }

    queryCurrentLocation() {
        getCurrentLocation({'desiredAccuracy': 3, 'updateDistance': 10, 'maximumAge': 20000, 'timeout': 30000}).then(
            (location) => {
                console.log("Buscou localizacao");
                console.log("Current location is: " + location.latitude + ", " + location.longitude);
                this.lat = location.latitude;
                this.lon = location.longitude;
                this.flagLocation = true;
                this.modo = -1;
                this.getBrindes(-1, this.lat, this.lon);
            },
            (rejeitado) => {
                console.log("Nao conseguiu localizacao");
                alert("Não foi possível trazer sua localização");
                this.navigate('/choice_city');

            }
        );
    }

    brindeEscolhido(obj: Brinde) {
        // SET iscaId
        if(this.brindeSvc.verificaBrinde(obj.empresa_brindeId)) {
            this.isca = obj.empresa_brindeId;
    
            let navigationExtras: NavigationExtras = { };
    
            navigationExtras.queryParams = {
                "estado": this.estado,
                "cidade": this.cidade,
                "latitude": this.lat,
                "longitude": this.lon,
                "brinde": this.isca
            }
    
            this.router.navigate(["/congrats"], navigationExtras);
        } else {
            alert("Este item não está mais disponível!");
            if(this.modo == -2) {
                this.getBrindes(this.modo, this.estado, this.cidade);
            } else {
                this.getBrindes(this.modo, this.lat, this.lon);
            }
        }        
    }

    pular() {
        let navigationExtras: NavigationExtras = { };
    
        navigationExtras.queryParams = {
            "estado": this.estado,
            "cidade": this.cidade,
            "latitude": this.lat,
            "longitude": this.lon,
            "brinde": null
        }
        this.router.navigate(["/congrats"], navigationExtras);
    }

    getBrindes(p_, latOrState, lonOrCity) {
        //
        this.isLoading = true;
        this.brindeLst = new Array<Brinde>();

        this.brindeSvc.getRows(p_, latOrState, lonOrCity)
           .subscribe(
               (loadedRows) => {
                   loadedRows.forEach(element => {
                       if(element.available == 1) {
                           this.brindeLst.push(element)
                       }
                   });
                this.isLoading = false;
               },
               () => {
                   alert("Não foi possível carregar a lista de brindes. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }
}
