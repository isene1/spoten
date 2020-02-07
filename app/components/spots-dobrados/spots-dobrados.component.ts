import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as geolocation from "nativescript-geolocation";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { SpotsDobradosService } from "~/shared/spots-dobrados/spots-dobrados.service";
import { SpotsDobrados } from "~/shared/spots-dobrados/spots-dobrados";
import { LocationService } from "~/shared/locationService/location.service";
import { EmpresaClickService } from '~/shared/empresa-click/empresa-click';


@Component({
    selector: "spots-dobrados",
    providers: [
        SpotsDobradosService,
        EmpresaClickService
    ],
    moduleId: module.id,
    templateUrl: "./spots-dobrados.component.html"
})


export class SpotsDobradosComponent extends ClasseBase implements OnInit {
    dtRows: any;
    private _dataEstabelecimentos: ObservableArray<SpotsDobrados>;
    isLoading: boolean = false;
    latOrState: number;
    lonOrCity: number;
    
    constructor(router: Router, private page: Page, private spotsDobrSvc: SpotsDobradosService, private emprClickSvc: EmpresaClickService) {
            super(router);
            //
    }

    ngOnInit(): void {
        this.verifyGeoLocationEnabled();
    }

    get dataEstabelecimentos(): ObservableArray<SpotsDobrados> {
        return this._dataEstabelecimentos;
    }

    public onTap( spotsDobrados: SpotsDobrados) {
        var aux = {
            empresaId: spotsDobrados.empresaId,
            fonte_click: 'spots_dobrados'
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
        console.log(spotsDobrados.nome_fantasia, spotsDobrados.empresaId);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "id": spotsDobrados.empresaId,
            }
        };
        this.router.navigate(["./estabelecimento/"], navigationExtras);
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
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
        //
        this._dataEstabelecimentos = new ObservableArray<SpotsDobrados>();
        this.isLoading = true;
        // for using on emulator
        //this.latOrState = -22.4252348;
        //this.lonOrCity = -45.4530274;
        //
        
        this.spotsDobrSvc.getRows(this.latOrState, this.lonOrCity)
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
}
