import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import * as app from "tns-core-modules/application";
import { ClasseBase } from "~/shared/classeBase";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert } from "tns-core-modules/ui/dialogs";

import { BuscaService } from "~/shared/busca/busca.service";
import { EmpresaClickService } from '~/shared/empresa-click/empresa-click';

@Component({
    selector: "busca",
    providers: [
        BuscaService,
        EmpresaClickService 
    ],
    moduleId: module.id,
    templateUrl: "./busca.component.html",
    styleUrls: ["./busca.component.css"]
})


export class BuscaComponent extends ClasseBase implements OnInit {
    dtRows: any;
    isLoading: boolean = false;
    public searchPhrase: string;
    
    constructor(
        router: Router, 
        private page: Page,
        private buscaSvc: BuscaService, private emprClickSvc: EmpresaClickService) {
        
        super(router);
        //
    }

    ngOnInit(): void {
        //
    }

    public onSubmit(args) {
        this.isLoading = true;
        let searchBar = <SearchBar>args.object;
        //console.log(searchBar.text);
        searchBar.dismissSoftInput();
        this.getRows(searchBar.text);
    }

    getRows(searchPhrase: string) {      
        this.buscaSvc.getRows(searchPhrase)
           .subscribe(
               (loadedRows) => {
                    this.dtRows = loadedRows;
                    //console.log(loadedRows[0].avaliacaoGeral);
                    this.isLoading = false;
                    if(this.dtRows.length == 0) {
                        let options = {
                            title: "Sem correspondência",
                            message: `Não foi possível encontrar um estabelecimento correspondente a ${searchPhrase} `,
                            okButtonText: "OK"
                        };
                        alert(options).then(() => {
                            console.log("alert valor <= 0");
                        });
                    }
               },
               () => {
                //    alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }

    public onTap(id: number) {
        var aux = {
            empresaId: id,
            fonte_click: 'busca_estabelecimento'
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
                "id": id,
            }
        };
        this.router.navigate(["./estabelecimento/"], navigationExtras);
    }    

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
