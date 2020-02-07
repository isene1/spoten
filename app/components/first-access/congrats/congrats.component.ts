import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { Cadastro } from '~/shared/cadastrar/cadastro';


@Component({
    selector: "congrats",
    providers: [
        
    ],
    moduleId: module.id,
    templateUrl: "./congrats.component.html"
})


export class CongratsComponent extends ClasseBase implements OnInit {
    
    estado: number = null;
    cidade: number = null;
    lat: number = null;
    lon: number = null;
    isca: number = null;

    constructor(
        router: Router, 
        private page: Page,
        private activRout: ActivatedRoute
    ) {
        super(router);

        this.activRout.queryParams.subscribe(params => {
            this.estado = params["estado"];
            this.cidade = params["cidade"];
            this.lat = params["latitude"];
            this.lon = params["longitude"];
            this.isca = params["brinde"];

            console.log(`log na tela congrats
            isca: ${this.isca}
            estado: ${this.estado}
            cidade: ${this.cidade}
            latitude: ${this.lat}
            longitude: ${this.lon}`);
        });
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    backToWelcome() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "estadoId": this.estado,
                "cidadeId": this.cidade
            }
        };
        this.router.navigate(["/welcome"], navigationExtras);
    }

    continuar() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "estado": this.estado,
                "cidade": this.cidade,
                "latitude": this.lat,
                "longitude": this.lon,
                "brinde": this.isca
            }
        };
        this.router.navigate(["/cadastrar"], navigationExtras);
    }

}
