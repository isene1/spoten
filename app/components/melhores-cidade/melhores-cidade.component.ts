import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { MelhoresCidade } from "../../shared/melhores-cidade/melhores-cidade";
import { MelhoresCidadeService } from "../../shared/melhores-cidade/melhores-cidade.service";
import { EmpresaClickService } from '~/shared/empresa-click/empresa-click';

@Component({
    selector: "melhores-cidade",
    providers: [
        MelhoresCidadeService,
        EmpresaClickService
    ],
    moduleId: module.id,
    templateUrl: "./melhores-cidade.component.html"
})


export class MelhoresCidadeComponent extends ClasseBase implements OnInit {
    dtRows: any;
    private _dataEstabelecimentos: ObservableArray<MelhoresCidade>;
    isLoading: boolean = false;
    latOrState: number;
    lonOrCity: number;

    constructor(router: Router, private page: Page, private melhoresCidadeService: MelhoresCidadeService, private emprClickSvc: EmpresaClickService) {
        super(router);
        //
    }

    ngOnInit(): void {
        this.verifyGeoLocationEnabled();
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
        this._dataEstabelecimentos = new ObservableArray<MelhoresCidade>();
        this.isLoading = true;
        this.melhoresCidadeService.getRows(this.latOrState, this.lonOrCity)
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

    get dataEstabelecimentos(): ObservableArray<MelhoresCidade> {
        return this._dataEstabelecimentos;
    }


    public onTap( melhor: MelhoresCidade) {
        var aux = {
            empresaId: melhor.empresaId,
            fonte_click: 'melhores_cidade'
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
        console.log(melhor.nome_fantasia, melhor.empresaId);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "id": melhor.empresaId,
            }
        };
        this.router.navigate(["./estabelecimento/"], navigationExtras);
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
