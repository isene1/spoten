import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { Estabelecimento } from "~/shared/estabelecimento/estabelecimento";
import { EstabelecimentoService } from "~/shared/estabelecimento/estabelecimento.service";
import { AuthService } from "../../shared/auth/auth.service";
import { CashbackService } from "../cashback/cashback.service";
import { Cashback } from "../cashback/cashback";


//import { registerElement } from "nativescript-angular/element-registry";
//registerElement('StarRating', ()=>  require('nativescript-star-ratings').StarRating);


@Component({
    selector: "estabelecimento",
    providers: [
        EstabelecimentoService,
        AuthService,
        CashbackService
    ],
    moduleId: module.id,
    templateUrl: "./estabelecimento.component.html",
    styleUrls: ['./estabelecimento.component.css']
})


export class EstabelecimentoComponent extends ClasseBase implements OnInit {
    dtRows: Estabelecimento;
    cashback: Cashback;
    isLoading: boolean = true;
    latOrState: number;
    lonOrCity: number;
    params: number;

    metade: boolean;
    userId: number;

    listStar: number[];
    
    constructor(
        router: Router, 
        private page: Page, 
        private lojaSvc: EstabelecimentoService, 
        private activRout: ActivatedRoute,
        private authSvc: AuthService,
        private cashbackSvc: CashbackService,
    ) {
            super(router);
            //
            this.dtRows = new Estabelecimento();
            this.isLoading = true;
            //this.activRout.params.subscribe(params => this.params = params["c"]);
            this.activRout.queryParams.subscribe(params => {
                this.params = params["id"];
            });
            console.log(`o parametro passado foi ${this.params}`);
            this.userId = this.authSvc.getUserId()["appuserId"];
    }

    ngOnInit(): void {
        //console.log(this.userId);
        this.getRows(this.params, this.userId);
    }

    getRows(id, user) {
        //
        this.dtRows = new Estabelecimento();
        this.isLoading = true;
        
        this.lojaSvc.getRows(id, user)
           .subscribe(
            (loadedRows) => {
                if (loadedRows[0].nome_fantasia == undefined) {
                    loadedRows[0].nome_fantasia = "";
                }
                    this.dtRows = loadedRows[0];
                    this.listStar = Array.from({length: loadedRows[0].avaliacaoGeral}, (value, key) => key + 1);
                    //console.log(this.listStar);
                    this.metade = this.restante();
                    this.isLoading = false;
                    this.lojaSvc.getCashbackEmpresa(user, id).subscribe((resp) => {
                        //console.log(resp);
                        if(resp.length == 0){
                            this.dtRows.valor = 0;
                            this.dtRows.percentComplete = 0;
                            this.dtRows.nivelRank = 1;
                        } else {
                            this.dtRows.valor = resp[0]["valor"];
                            this.dtRows.percentComplete = resp[0]["percentComplete"];
                            this.dtRows.nivelRank = resp[0]["nivelRank"];
                        }
                    });
                    //console.log(loadedRows[0]);
            }, () => {
                // alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                this.isLoading = false;
            }
        );
    }

    setProgressbarWidth(percent) {
        return percent + "*," + (100 - percent) + "*";
    }

    progressbar(item) {
        return "progressbar-value" + item.nivelRank;
    }

    descricao_spots(item) {
        return "$ " + item.valor;
    }

    restante() {
        return ((this.dtRows.avaliacaoGeral - Math.trunc(this.dtRows.avaliacaoGeral)) > 0);
    }
}
