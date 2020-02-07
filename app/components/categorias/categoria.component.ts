import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";

import { Categoria } from "~/shared/categoria/categoria";
import { EstabelecimentoCategoria } from "~/shared/categoria/estabCategoria"
import { CategoriaService } from "~/shared/categoria/categoria.service";
import { ValueList, DropDown, SelectedIndexChangedEventData } from "nativescript-drop-down";
import { EmpresaClickService } from '~/shared/empresa-click/empresa-click';

@Component({
    selector: "categoria",
    providers: [
        CategoriaService,
        EmpresaClickService
    ],
    moduleId: module.id,
    templateUrl: "./categoria.component.html",
    styleUrls: ['./categoria.component.css']
})


export class CategoriaComponent extends ClasseBase implements OnInit {
    //private _dataEstabelecimentos: ObservableArray<EstabelecimentoCategoria>;
    private _dataEstabelecimentos = new ObservableArray<EstabelecimentoCategoria>();
    isLoading: boolean = false;
    latOrState: number;
    lonOrCity: number;

    categorias = new Array<Categoria>();
    filtros = new ValueList<string>([
        { value: "1", display: "Melhores Avaliados" }, 
        { value: "2", display: "Mais Próximos" }
    ]);

    filtro: number = -1;
    categoria: number = -1;
    
    constructor(
        router: Router, 
        private page: Page,
        private categoriaService: CategoriaService, private emprClickSvc: EmpresaClickService
    ) {
        super(router);
    }


    ngOnInit(): void {
        this.getCategorias();
        this.verifyGeoLocationEnabled();
    }

    getCategorias() {
        this.categoriaService.getRows().subscribe(
            (loadedRows) => {
                loadedRows.forEach(element => {
                    element.select = false;
                    this.categorias.push(element);
                });
            }, () => {
                this.categorias.push();
                alert("Não foi possível carregar a lista de Categorias");
            }
        )
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
                this.categoriaService.getEstabelecimentosInicial(this.latOrState, this.lonOrCity).subscribe(
                    (loadedRows) => {
                        this._dataEstabelecimentos = loadedRows;
                        this.isLoading = false;
                        if(!this._dataEstabelecimentos.length) {
                            alert("Ainda não existem estabelecimentos parceiros da Spoten na sua região!\nVocê também pode encontrar estabelecimentos na busca ou no mapa.");
                        }
                    },
                    () => {
                        alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                           this.isLoading = false;
                    }
                );
            },
            (rejeitado) => {
                console.log("Nao conseguiu localizacao");
                alert("Não foi possível trazer sua localização!");
                this.isLoading = false;
            }
        );
    }

    getRows(cat: number, fil: number) {
        this.isLoading = true;
        this.categoriaService.getEstabelecimentos(this.latOrState, this.lonOrCity, cat, fil)
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

    get dataEstabelecimentos(): ObservableArray<EstabelecimentoCategoria> {
        return this._dataEstabelecimentos;
    }

    onTap(obj: Categoria) {
        this.categoria = obj.categoriaLojaId;
        this.categorias.forEach(element => {
            if(obj.categoriaLojaId == element.categoriaLojaId){
                element.select = true;
            } else {
                element.select = false;
            }
        });
        console.log(obj);
    }

    onChangeCategoria(args: SelectedIndexChangedEventData) {
        this.filtro = args.newIndex;
        console.log(args.newIndex);
    }

    buscar() {
        this.isLoading = true;
        if(this.categoria == -1 || this.filtro == -1) {
            alert("Você deve escolher uma categoria e um filtro para realizar a busca!");
        }
        else {
            this.getRows(this.categoria, this.filtro);
        }
    }

    toLoja(loja: EstabelecimentoCategoria) {
        var aux = {
            empresaId: loja.empresaId,
            fonte_click: 'categorias'
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
                "id": loja.empresaId,
            }
        };
        this.router.navigate(["./estabelecimento/"], navigationExtras);
    }
}
