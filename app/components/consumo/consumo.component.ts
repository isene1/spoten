import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { TextField } from "tns-core-modules/ui/text-field";

import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";
import { RouterExtensions } from "nativescript-angular/router";

import { EstabelecimentoConsumo } from "~/shared/consumo/estConsumo";
import { ConsumoService } from "~/shared/consumo/consumo.service";

@Component({
    selector: "consumo",
    providers: [
        ConsumoService
    ],
    moduleId: module.id,
    templateUrl: "./consumo.component.html"
})


export class ConsumoComponent extends ClasseBase implements OnInit {
    dtRows: any;
    isLoading = false;
    latOrState: number;
    lonOrCity: number;
    private _dataEstabelecimentos = new Array<EstabelecimentoConsumo>();
    searchText: String = "";
    
    constructor(
        router: Router, 
        private page: Page,
        private consumoService: ConsumoService,
        private routerExtentions: RouterExtensions) {
        super(router);
    }

    ngOnInit(): void {
        if (!isAndroid) {
            return;
        }
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            if (this.router.isActive("/consumo", false)) {
                data.cancel = true; // prevents default back button behavior
                this.back();
            }
        });
        this.verifyGeoLocationEnabled();
    }

    back() {
        this.routerExtentions.navigate(["./em_alta"], { clearHistory: true });
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
            },
            (rejeitado) => {
                console.log("Nao conseguiu localizacao");
                alert("Não foi possível trazer sua localização");
                this.isLoading = false;
            }
        );
    }

    getRows() {
        this._dataEstabelecimentos = new Array<EstabelecimentoConsumo>();
        this.isLoading = true;
        this.consumoService.getEstabelecimentos(this.latOrState, this.lonOrCity)
           .subscribe(
               (loadedRows) => {
                    this._dataEstabelecimentos = loadedRows;
                    this.isLoading = false;
               },
               () => {
                alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }

    get dataEstabelecimentos(): Array<EstabelecimentoConsumo> {
        return this._dataEstabelecimentos;
    }

    onTap(estabelecimento: EstabelecimentoConsumo) {
        //console.log(estabelecimento);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "id": estabelecimento.empresaId,
                "nome": estabelecimento.nome_fantasia
            }
        };
        this.router.navigate(["./avaliacao/"], navigationExtras);
    }

    onTextChange(args){
        let textField = <TextField>args.object;
        this.searchText = textField.text;
    }
}
