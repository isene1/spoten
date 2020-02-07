import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { UfService } from "~/shared/uf/uf.service";
import { Uf } from "~/shared/uf/uf";
import { CidadeService } from "~/shared/cidade/cidade.service";
import { Cidade } from "~/shared/cidade/cidade";
import { TextField } from "tns-core-modules/ui/text-field";

import { SelectedIndexChangedEventData, ValueList, ValueItem } from "nativescript-drop-down";

import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
    selector: "choice-city",
    providers: [
        UfService,
        CidadeService
    ],
    moduleId: module.id,
    templateUrl: "./choice-city.component.html"
})


export class ChoiceCityComponent extends ClasseBase implements OnInit {
    estadoLst: Array<Uf>;
    cidadeLst: Array<Cidade>;
    isLoading: boolean = true;

    estados = new ValueList<string>();
    cidades = new ValueList<string>();
    estado = 0;
    cidade = 0;

    selectedIndexCity = 0;
    selectedIndexUF = 0;

    cityTf:TextField;
    citySujestion: ValueItem<string>[] = [];
    sujestionListShow = false;
    
    constructor(
        router: Router, 
        private page: Page, 
        private ufSvc: UfService,
        private cidSvc: CidadeService) {
        super(router);
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.getEstados();
    }

    getEstados() {
        this.estadoLst = new Array<Uf>();
        this.ufSvc.getRows(-1)
           .subscribe(
               (loadedRows) => {
                   loadedRows.forEach(element => {
                       this.estados.push({
                           value: element.estadoId.toString(),
                           display: element.name.toString(),
                       });
                       //console.log(element.estadoId + ' ------ ' + element.name);
                   });
                   this.isLoading = false;
               },
               () => {
                   this.estados.push();
                   alert("Não foi possível carregar a lista de estados");
               }
        );
    }

    // query city based on choosed state.
    getCidades(id) {
        this.isLoading = true;
        this.cidadeLst = new Array<Cidade>();
        this.cidades = new ValueList<string>();
        //
        this.cidSvc.getRows(id)
           .subscribe(
               (loadedRows) => {
                   loadedRows.forEach(element => {
                       this.cidades.push({
                           value: element.cidadeId.toString(),
                           display: element.name.toString(),
                       });
                   });
                    this.isLoading = false;
               },
               () => {
                   this.cidades.push();
                   alert("Não foi possível carregar a lista de cidades");
               }
        );
    }

    public onchangeEstado(args: SelectedIndexChangedEventData) {
        this.estado = parseInt(this.estados.getValue(args.newIndex));
        //console.log("Estado: " + this.estado);
        this.getCidades(this.estados.getValue(args.newIndex));
    }

    public onchangeCidade(args: SelectedIndexChangedEventData) {
        this.cidade = parseInt(this.cidades.getValue(args.newIndex));
        console.log("Cidade: " + this.cidade);
    }

    saveLocationAndRedirect() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "cidadeId": this.cidade,
                "estadoId": this.estado
            }
        };
        if(this.estado === 0 || this.cidade === 0) {
            dialogs.alert("Você deve escolher um estado e uma cidade válidos!");
        } else {
            this.router.navigate(["/welcome"], navigationExtras);
        }
    }

    onTextChange(){
        if(this.cityTf == undefined){
            return;
        }
    	if(this.cityTf.text == null || this.cityTf.text == undefined){
    		return;
    	}

        this.citySujestion = this.cidades.filter(
            (value: ValueItem<string>, index: number, array: ValueItem<string>[]): boolean => {
                if(value.display.includes(this.cityTf.text)){
                    return true;
                }

                return false;
            }
        );

        if(this.citySujestion.length > 0){
        	this.sujestionListShow = true;
        }
        else{
        	this.sujestionListShow = false;
        }
    }
    citySelected(item: ValueItem<string>){
        if(this.cityTf == undefined){
            return;
        }
        this.cidade = Number.parseInt(item.value);
        this.cityTf.text = item.display;
        this.sujestionListShow = false;
        this.citySujestion = [];
        this.cityTf.dismissSoftInput();
    }
    onClear(){
        this.citySujestion = [];
        this.sujestionListShow = false;
    }
    onSubmit(){
        if(this.cityTf == undefined){
            return;
        }
        if(this.citySujestion.length == 1){
            this.cidade = Number.parseInt(this.citySujestion[0].value);
            this.cityTf.text = this.citySujestion[0].display;
            this.sujestionListShow = false;
            this.citySujestion = [];
        }
        else{
            alert("Por favor, selecione uma cidade");
        }
    }

    onLoad(args){
        this.cityTf = <TextField>args.object;
    }
}
