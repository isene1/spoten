import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "ui/page";
import { alert } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { Perfil } from "~/shared/perfil/perfil";
import { PerfilService } from "~/shared/perfil/perfil.service";
import { AuthService } from "../../shared/auth/auth.service";
import { UfService } from "../../shared/uf/uf.service";
import { CidadeService } from "../../shared/cidade/cidade.service";
import { ClasseBase } from '~/shared/classeBase';
import { SelectedIndexChangedEventData, ValueList, ValueItem } from "nativescript-drop-down";

@Component({
    selector: "perfil",
    providers: [
        PerfilService,
        AuthService,
        UfService,
        CidadeService
    ],
    moduleId: module.id,
    templateUrl: "./perfil.component.html"
})


export class PerfilComponent extends ClasseBase implements OnInit {

    isLoading: boolean = false;
    perfil: Perfil = new Perfil();
    userId: number;

    states = new ValueList<string>();
    cities = new ValueList<string>();
    citySujestion: ValueItem<string>[] = [];

    cityTf:TextField;
    cityName: string = "";
    selectedState;
    sujestionListShow = false;

    constructor(
        router: Router,
        private perfilService: PerfilService,
        private authSvc: AuthService,
        private ufSvc: UfService,
        private cidadeSvc: CidadeService,
        private routerExtentions: RouterExtensions
    ) {
        super(router);
        this.userId = this.authSvc.getUserId()["appuserId"];
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.getStates();
    }
    
    getPerfil(userId) {
        let telefone = "";
        let nascimento = "";
        this.perfil = new Perfil();
        this.perfilService.getRows(userId)
            .subscribe(
            (loadedRows) => {
                nascimento = loadedRows[0].birth.split('-')[2] + loadedRows[0].birth.split('-')[1] + loadedRows[0].birth.split('-')[0];
                loadedRows[0].phone = loadedRows[0].phone.substring(1,3) + loadedRows[0].phone.substring(5, loadedRows[0].phone.length);
                telefone = loadedRows[0].phone.split('-')[0] +loadedRows[0].phone.split('-')[1]
                this.perfil.name = loadedRows[0].name;
                this.perfil.surname = loadedRows[0].surname;
                this.perfil.birth = nascimento;
                this.perfil.phone = telefone;
                this.perfil.stateId = loadedRows[0].estadoId;

                if(this.perfil.stateId != null && this.perfil.stateId != undefined){
                	this.selectedState = this.states.getIndex(this.perfil.stateId.toString());
                }
                if(this.perfil.stateId != null && this.perfil.stateId != undefined){
                    this.getCities(this.perfil.stateId);
                }
                this.perfil.cityId = loadedRows[0].cidadeId;
                this.cityName = loadedRows[0].cidade;
                this.isLoading = false;
            },
            () => {
                alert("Não foi possível carregar perfil");
            }
        );
    }

    getStates(){
        this.states = new ValueList<string>();
        this.ufSvc.getRows(-1).subscribe(
            (result: any[]) => {
                result.forEach(elem => {
                    this.states.push({
                        value:   elem.estadoId.toString(),
                        display: elem.name.toString()
                    });
                });

                this.getPerfil(this.userId);
            }
        );
    }

    getCities(id){
        this.cities = new ValueList<string>();
        this.cidadeSvc.getRows(id).subscribe(
            (result: any[]) => {
                result.forEach(elem => {
                    this.cities.push({
                        value:   elem.cidadeId.toString(),
                        display: elem.name.toString()
                    });
                });
            }
        );
    }

    onChangeState(args: SelectedIndexChangedEventData) {
        this.perfil.stateId = parseInt(this.states.getValue(args.newIndex));

        this.getCities(this.perfil.stateId);
    }

    onChangeCity(args: SelectedIndexChangedEventData) {
        this.perfil.cityId = parseInt(this.cities.getValue(args.newIndex));
    }

    onTap() {
        let str = this.perfil.birth.split('/');
        this.perfil.birth = str[2] + '-' + str[1] + '-' + str[0];

        if(!this.verificaNascimento()){
            let output: JSON;
            let obj: any = {
                "row": this.perfil
            };
            output = <JSON> obj;
            // console.log(output);
            this.perfilService.altRow(this.userId, output)
            .subscribe((loadedRows) => {
                let options = {
                    title: "Editar Perfil",
                    message: `Perfil alterado com sucesso.`,
                    okButtonText: "OK"
                };
                this.routerExtentions.navigate(["./em_alta"], { clearHistory: true });
                alert(options).then(() => {
                });
            });
        } else {
            return;
        }
    }

    verificaNascimento(): boolean {
        let erro: boolean = false;
        let arrayData = this.perfil.birth.split('-');
        console.log(arrayData);
        if(+arrayData[2] > 31 || +arrayData[2] < 1 || +arrayData[1] > 12 || +arrayData[1] < 1 || +arrayData[0] < 1919) {
            erro = true;
            alert(`Verifique o campo data de nascimento.`);
            this.perfil.birth = arrayData[2] + arrayData[1] + arrayData[0];
            return erro;
        } else {
            return false;
        }
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onTextChange(){
    	if(this.cityTf.text == null || this.cityTf.text == undefined){
    		return;
    	}
        if(this.cityName != undefined && this.cityName != null && this.cityTf.text.match(this.cityName)){
            return;
        }

        this.cityName = undefined;
        this.citySujestion = this.cities.filter(
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
        this.perfil.cityId = Number.parseInt(item.value);
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
        if(this.citySujestion.length == 1){
            this.perfil.cityId = Number.parseInt(this.citySujestion[0].value);
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