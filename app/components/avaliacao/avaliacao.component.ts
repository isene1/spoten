import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";


@Component({
    selector: "avaliacao", 
    providers: [
    ],
    moduleId: module.id,
    templateUrl: "./avaliacao.component.html",
    styleUrls: ['./avaliacao.component.css']
})

export class AvaliacaoComponent extends ClasseBase implements OnInit {
    
    idEmpresa: number;
    nomeEmpresa: string;

    av1: number = 1;
    ar1: number[] = new Array(1);
    av2: number = 1;
    ar2: number[] = new Array(1);
    av3: number = 1;
    ar3: number[] = new Array(1);
    av4: number = 1;
    ar4: number[] = new Array(1);

    listStar = Array.from({length: 5}, (value, key) => key + 1);

    constructor(        
        router: Router, 
        private page: Page,
        private activRout: ActivatedRoute) {
        super(router);
        this.activRout.queryParams.subscribe(params => {
            this.idEmpresa = params["id"];
            this.nomeEmpresa = params["nome"];
        });
        console.log(`o parametro passado foi ${this.idEmpresa}`);
    }

    ngOnInit() {
        console.log(`id: ${this.idEmpresa} nome: ${this.nomeEmpresa}`);
    }

    finalizar() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "empresaId": this.idEmpresa,
                "nome_fantasia": this.nomeEmpresa,
                "aval_01": this.av1,
                "aval_02": this.av2,
                "aval_03": this.av3,
                "aval_04": this.av4
            }
        };
        this.router.navigate(["./registra_consumo/"], navigationExtras);
    }

    tapItem1(indice: number) {
        this.av1 = indice;
        this.ar1 = new Array(indice);
    }

    tapItem2(indice: number) {
        this.av2 = indice;
        this.ar2 = new Array(indice);
    }

    tapItem3(indice: number) {
        this.av3 = indice;
        this.ar3 = new Array(indice);
    }
    
    tapItem4(indice: number) {
        this.av4 = indice;
        this.ar4 = new Array(indice);
    }
}