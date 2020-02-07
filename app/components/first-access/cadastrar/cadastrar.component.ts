import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { Cadastro } from '~/shared/cadastrar/cadastro';
import { CadastroService } from "~/shared/cadastrar/cadastro.service";
const firebase = require("nativescript-plugin-firebase");
import * as utils from "tns-core-modules/utils/utils";
import { SexService } from "~/shared/sex/sex.service";
import { ValueList, SelectedIndexChangedEventData } from "nativescript-drop-down";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";
import { RouterExtensions } from "nativescript-angular/router";
import { Switch } from "tns-core-modules/ui/switch";

import { Interesse } from "~/shared/interesse/interesse";
import { InteresseService } from "~/shared/interesse/interesse.service";

@Component({
    selector: "cadastrar",
    providers: [
        CadastroService,
        SexService,
        InteresseService
    ],
    moduleId: module.id,
    templateUrl: "./cadastrar.component.html",
    styleUrls: ['./cadastrar.component.css']
})


export class CadastrarComponent extends ClasseBase implements OnInit {

    dtRows: Cadastro;
    isLoading: boolean = false;
    public sexLst: ValueList<string>;
    public webViewSrc: string = "";
    @ViewChild("myWebView") webViewRef: ElementRef;
    webViewInstaEnabled: boolean = false;
    instagramClientId = "f754cc2ca2dc4a598ff746223982ed5c";

    interesses: Array<Interesse>;
    interessesCadastro = new Array<Interesse>();
    confirmaSenha: string = "";
    stateWebView: string = "first_time";

    switchState: string = "OFF";
    nascimento: string;

    constructor(
        router: Router,
        private page: Page,
        private activRout: ActivatedRoute,
        private sexSvc: SexService,
        private cadastroSvc: CadastroService,
        private interesseSvc: InteresseService,
        private routerExtentions: RouterExtensions,
    ) {
        super(router);
        this.dtRows = new Cadastro();
        this.activRout.queryParams.subscribe(params => {
            this.dtRows.estadoId = params["estado"];
            this.dtRows.cidadeId = params["cidade"];
            this.dtRows.latitude = params["latitude"];
            this.dtRows.longitude = params["longitude"];
            this.dtRows.iscaId = params["brinde"];
        });
        this.getHashtags();
        this.getSex();
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        // start firebase
        firebase.init({
            // options
        }).then(
            instance => {
                // console.log("firebase init done");
                this.isLoading = true;
                //this.getSex();
                //
                console.log(`firebase init succes`);
            },
            error => {
                console.log(`firebase.init error: ${error}`);
                console.log(`FIREBASE: ${error}`);
            }
        );
        this.dtRows.fName = null;
        this.dtRows.cpf = null;
        this.dtRows.phone = null;
        this.dtRows.birth = null;
        this.nascimento = null;
    }

    getHashtags() {
        this.interesses = new Array<Interesse>();
        this.interesseSvc.getRows(-1)
           .subscribe(
               (loadedRows) => {
                   loadedRows.forEach(element => {
                       this.interesses.push({
                            interesseId: element.interesseId,
                            name: element.name,
                            select: false
                       });
                   });
                    this.isLoading = false;
               },
               () => {
                   this.isLoading = false;
                   alert("Houve um erro ao carregar campos de cadastro. Tente novamente.");
               }
        );
    }

    registraInteresse(obj: Interesse) {
        //console.log(`interesse em ${obj.name} ${obj.select} index ${this.interesses.indexOf(obj)} select do index ${this.interesses[this.interesses.indexOf(obj)].select}`);
        if (obj.select == false) {
            if (this.interesses.indexOf(obj) >= 0) {
                this.interesses[this.interesses.indexOf(obj)].select = true;
                this.interessesCadastro.push(obj);
            }
        } else {
            if (this.interesses.indexOf(obj) >= 0) {
                this.interesses[this.interesses.indexOf(obj)].select = false;
                this.interessesCadastro.splice(this.interessesCadastro.indexOf(obj), 1);
            }
        }
    }

    conectViaFB() {
        firebase.login({
            type: firebase.LoginType.FACEBOOK,
            // Optional
            facebookOptions: {
                type: firebase.LoginType.FACEBOOK,
                scope: ['public_profile', 'email']
            }
        }).then(
            (result) => {
                console.log(`resposta sucesso facebook: ${result}`);
                JSON.stringify(result);
                var fb_access_token = result.providers[1].token;
                this.dtRows.tokenFB = fb_access_token;
                //
                firebase.getCurrentUser()
                .then(
                    (user) => {
                        console.log("User email: " + user.email); 
                        this.dtRows.email = user.email;
                        this.postOnDbFB();
                    }
                )
                .catch((error) => {
                    console.log("Could not bring the info from facebook: " + error);
                    alert("Não foi possível buscar os dados do facebook. Tente novamente.");
                });
            },
            (errorMessage) => {
                console.log(errorMessage);
                alert("Não foi possível conectar com o Facebook");
            }
        );
    }

    conectViaInsta() {
        var urlAuth = 'https://api.instagram.com/oauth/authorize/?client_id='+this.instagramClientId+'&redirect_uri=http://spotenapp.com/i&response_type=token';
        this.webViewSrc = urlAuth;
        this.webViewInstaEnabled = true;
        let webview: WebView = this.webViewRef.nativeElement;
        let userName: string = "";

        webview.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            var accessToken = args.url ? args.url.split('#')[1] : undefined;
            var userDenied = args.url ? args.url.split('error=')[1] : undefined;
            // var urlDeFora = args.url ? args.url.split('spotenapp.com')[1] : undefined;
            if(accessToken) {
                if(this.stateWebView == "first_time") {
                    console.log(`access token: ${accessToken}`);
                    this.webViewInstaEnabled = false;
                    this.cadastroSvc.getUserInstagram(accessToken)
                        .subscribe(
                            (loadedRows) => {
                                userName = loadedRows.data.username;
                                if(userName) {
                                    console.log("userName: " + userName);
                                    this.dtRows.userNameInsta = userName;
                                    this.dtRows.tokenInstagram = accessToken;
                                    this.dtRows.email = `${userName}@email.com`;
                                    this.postOnDbInsta();
                                    console.log(this.dtRows);
                                }
                            }
                    );
                    this.stateWebView = "second_time";
                    this.closeWebView();
                }
            }
            if (userDenied) {
                this.webViewSrc = urlAuth;
                console.log("O acesso ao Instagram foi recusado");
                this.closeWebView();
            }
            console.log("web view loadFinishedEvent");
        });
    }

    getSex() {
        this.sexLst = new ValueList<string>();
        this.sexSvc.getRows(-1)
           .subscribe(
               (loadedRows) => {
                    loadedRows.forEach(ni => {
                        this.sexLst.push({
                            value: ni.sexId.toString(),
                            display: ni.name.toString()
                        });
                    });
                    this.isLoading = false;
               },
               () => {
                   this.isLoading = false;
                   alert("Houve um erro ao carregar campos de cadastro. Tente novamente.");
               }
        );
    }

    onChangeSex(args: SelectedIndexChangedEventData) {
        this.dtRows.sexId = parseInt(this.sexLst.getValue(args.newIndex));
        // console.log(this.dtRows.sexId);
    }

    postOnDb() {
        //
        // create user on firebase (it helps when resetting the password)
        if(this.dtRows.fName == null || this.dtRows.cpf == null || this.dtRows.phone == null || 
            this.dtRows.sexId == null) {
                alert("Os campos com * devem serpreenchidos!");
                return;
            }
        if(this.dtRows.email == null || this.dtRows.senha == null) {
            alert("Os campos e-mail e senha devem ser preenchidos");
            return;
        }
        if(this.dtRows.cpf) {            
            let cpfForm = this.dtRows.cpf.split(' ');
            this.dtRows.cpf = cpfForm[0] + cpfForm[1] + cpfForm[2] +cpfForm[3];
            this.dtRows.cpf = this.dtRows.cpf.substring(0, 11);
        }
        console.log(`validação do cpf: ${this.validaCPF()}`);
        if(this.validaCPF() == 0){
            console.log("entrou no if do cpf");
            alert("CPF inválido!");
            return;
        }
        
        let erroForm: boolean = false;

        let msgErro: string = 'Favor verifique os seguintes campos:\n';
        let msgErroGeral: string = this.verificaDadosGeral();
        let msgErroEmail: string = this.verificaEmailSenha();
        if(msgErroGeral) {
            msgErro += msgErroGeral;
            erroForm = true;
        } if(msgErroEmail) {
            msgErro += msgErroEmail;
            erroForm = true;
        }
        if(erroForm) {
            alert(msgErro);
            this.confirmaSenha = '';
            return;
        }
        this.confirmaSenha = '';
        this.dtRows.interesses = this.interessesCadastro;
        this.dtRows.tokenFB = null;
        this.dtRows.tokenInstagram = null;
        if(this.nascimento) {
            let str = this.nascimento.split('/');
            this.dtRows.birth = str[2] + '-' + str[1] + '-' + str[0];
            console.log(this.dtRows.birth);
        }
        let tempSenha = this.dtRows.senha;
        this.dtRows.senha = null;
        console.log(this.dtRows);
        this.cadastroSvc.postOnDb(this.dtRows)
          .subscribe(
            (loadedRows) => {
                console.log(loadedRows);
                if(loadedRows.status == 200) {
                    firebase.createUser({
                        email: this.dtRows.email,
                        password: tempSenha
                    }).then(
                        function (user) {
                            alert({
                                title: "Usuário Criado com sucesso!",
                                message: "email: " + user.email,
                                okButtonText: "Ok!"
                            });
                        },
                        function (errorMessage) {
                            alert({
                                title: "O usuário não foi criado",
                                message: errorMessage,
                                okButtonText: "OK"
                            })
                        }
                        );
                    this.routerExtentions.navigate(["./auth"], { clearHistory: true });
                } else {
                    alert(loadedRows.message);
                    return;
                }
            },
            (error) => {
                console.log(error);
                alert("Houve um erro ao salvar seu cadastro.\nTente novamente mais tarde.");
            }
        );
    }

    postOnDbFB():boolean {
        //
        if(this.dtRows.fName == null || this.dtRows.cpf == null || this.dtRows.phone == null || 
            this.dtRows.sexId == null) {
                alert("Os campos com * devem ser preenchidos!");
                return false;
            }
        if(this.dtRows.cpf) {            
            let cpfForm = this.dtRows.cpf.split(' ');
            this.dtRows.cpf = cpfForm[0] + cpfForm[1] + cpfForm[2] +cpfForm[3];
            this.dtRows.cpf = this.dtRows.cpf.substring(0, 11);
        }
        if(this.validaCPF() == 0){
            alert("CPF inválido!");
            return;
        }
        let erroForm: boolean = false;
        let msgErro: string = 'Favor verifique os seguintes campos:\n';
        let msgErroGeral: string = this.verificaDadosGeral();
        if(msgErroGeral) {
            msgErro += msgErroGeral;
            erroForm = true;
        } 
        if(erroForm) {
            alert(msgErro);
            this.confirmaSenha = '';
            return false;
        }
        this.confirmaSenha = '';
        this.dtRows.interesses = this.interessesCadastro;
        this.dtRows.tokenFB = null;
        this.dtRows.tokenInstagram = null;
        if(this.nascimento) {
            if(this.nascimento.includes('/')) {
                let str = this.nascimento.split('/');
                this.dtRows.birth = str[2] + '-' + str[1] + '-' + str[0];
                console.log(this.dtRows.birth);
            }
        }
        this.dtRows.senha = null;
        console.log(this.dtRows);
        this.cadastroSvc.postOnDb(this.dtRows)
          .subscribe(
            (loadedRows) => {
                if(loadedRows.status == 200) {
                    console.log("Salvo com sucesso no banco spoten");
                    this.routerExtentions.navigate(["./auth"], { clearHistory: true });
                    return true;
                } else {
                    return false;
                }
            },
            (error) => {
              this.isLoading = false;
              alert("Houve um erro ao salvar seu cadastro.\nTente novamente mais tarde.");
              return false;
            }
        );
    }

    postOnDbInsta():boolean {
        //
        if(this.dtRows.fName == null || this.dtRows.cpf == null || this.dtRows.phone == null || this.dtRows.sexId == null) {
            alert("Os campos com * devem ser preenchidos!");
            return false;
        }
        if(this.dtRows.cpf) {            
            let cpfForm = this.dtRows.cpf.split(' ');
            this.dtRows.cpf = cpfForm[0] + cpfForm[1] + cpfForm[2] +cpfForm[3];
            this.dtRows.cpf = this.dtRows.cpf.substring(0, 11);
        }
        if(this.validaCPF() == 0){
            alert("CPF inválido!");
            return;
        }
        let erroForm: boolean = false;
        let msgErro: string = 'Favor verifique os seguintes campos:\n';
        let msgErroGeral: string = this.verificaDadosGeral();
        if(msgErroGeral) {
            msgErro += msgErroGeral;
            erroForm = true;
        } 
        if(erroForm) {
            alert(msgErro);
            this.confirmaSenha = '';
            return false;
        }
        this.confirmaSenha = '';
        this.dtRows.interesses = this.interessesCadastro;
        this.dtRows.tokenFB = null;
        let token = this.dtRows.tokenInstagram.split("=");
        this.dtRows.tokenInstagram = token[1];
        if(this.nascimento) {
            if(this.nascimento.includes('/')) {
                let str = this.nascimento.split('/');
                this.dtRows.birth = str[2] + '-' + str[1] + '-' + str[0];
                console.log(this.dtRows.birth);
            }
        }
        this.dtRows.senha = null;
        console.log(this.dtRows);
        this.cadastroSvc.postOnDb(this.dtRows)
          .subscribe(
            (loadedRows) => {
                if(loadedRows.status == 200) {
                    console.log("Salvo com sucesso no banco spoten");
                    this.routerExtentions.navigate(["./auth"], { clearHistory: true });
                    return true;
                } else {
                    return false;
                }
            },
            (error) => {
              this.isLoading = false;
              alert("Houve um erro ao salvar seu cadastro.\nTente novamente mais tarde.");
              return false;
            }
        );
    } 

    verificaDadosGeral(): string {
        let erro: boolean = false;
        let msgErro: string = '';
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let arrayData: string[];
        if(this.nascimento) {
            arrayData = this.nascimento.split('/');
        }
        let atual = new Date();
        if (this.dtRows.fName == null || this.dtRows.fName == '') {
            erro = true;
            msgErro += `\n\tO campo nome é requerido.`;
        } if (this.dtRows.cpf.includes('_') || !this.dtRows.cpf) {
            erro = true;
            msgErro += `\n\tO campo CPF é requerido.`;
        } if (this.dtRows.cpf.length > 11) {
            erro = true;
            msgErro += `\n\tVerifique o campo CPF novamente.`;
        } if(!pattern.test(this.dtRows.email)) {
            erro = true;
            msgErro += `\n\tE-mail inválido`;
        } if (this.dtRows.phone == null || this.dtRows.phone == '') {
            erro = true;
            msgErro += `\n\tO campo telefone. é requerido`;
        } if (this.dtRows.sexId == null) {
            erro = true;
            msgErro += `\n\tO campo sexo é requerido.`;
        } if (this.nascimento == null || this.nascimento == '') {
            erro = true;
            msgErro += `\n\tO campo data de nascimento é requerido.`;
        } if (this.interessesCadastro.length == 0) {
            erro = true;
            msgErro += `\n\tDefina ao menos um interesse.`;
        } if(+arrayData[2] > atual.getFullYear() -14 ) {
            erro = true;
            msgErro += `\n\tVerifique a classificação do App.`;
        } if(+arrayData[0] > 31 || +arrayData[0] < 1 || +arrayData[1] > 12 || +arrayData[1] <1 || +arrayData[2] < 1919) {
            erro = true;
            msgErro += `\n\tVerifique o campo data de nascimento.`;
        } if(this.switchState == "OFF") {
            erro = true;
            msgErro += `\n\tVocê não concorda com os termos.`;
        }
        if(!erro){
            return msgErro = null;
        }
        return msgErro;
    }

    verificaEmailSenha(): string {
        let msgErro: string = '';
        if ((this.dtRows.email == null || this.dtRows.email == '') && (this.dtRows.senha == null || this.dtRows.senha == '')) {
            msgErro += "\n\tE-mail e senha devem ser preenchidos."
        } if(this.dtRows.senha.length < 6) {
            msgErro += "\n\tA senha deve ter ao menos 6 caracteres."
        } if(this.dtRows.senha != this.confirmaSenha) {
            msgErro += "\n\tSenha e confirmação de senha estão diferentes."
            this.dtRows.senha = "";
            this.confirmaSenha = "";
        }
        return msgErro;
    }

    public checked(args) {
        let firstSwitch = <Switch>args.object;
        if (firstSwitch.checked) {
            this.switchState = "ON";
            console.log("on");
        } else {
            this.switchState = "OFF";
            console.log("off");
        }
    }

    validaCPF(): number {
        let isValid = 1;
        let rangeDig = 10;
        let soma = 0;
        for (let i = 0; i < this.dtRows.cpf.length - 2; i++) {
            soma += +this.dtRows.cpf[i] * rangeDig;
            rangeDig--;
        }
        let resto = soma % 11;
        console.log(`soma: ${soma}, resto: ${resto}`);
        console.log(`1 dig verificador: ${11 - resto} > 9 entao ${this.dtRows.cpf[9]} = 0`);
        console.log(`1 dig verificador: ${11 - resto} < 9 entao ${this.dtRows.cpf[9]} = ${11 - resto}`);
        if(11 - resto > 9) {
            if(parseInt(this.dtRows.cpf[9]) != 0) {
                isValid = 0;
            }
        } else {
            if((11 - resto) != parseInt(this.dtRows.cpf[9])) {
                isValid = 0;
            }   
        }

        console.log(`isValid: ${isValid}`);
        if(!isValid) {
            return isValid;
        }

        rangeDig = 11;
        soma = 0;
        for(let i = 0; i < this.dtRows.cpf.length - 1; i++) {
            soma += +this.dtRows.cpf[i] * rangeDig;
            rangeDig--;
        }
        resto = soma % 11;
        console.log(`soma: ${soma}, resto: ${resto}`);
        console.log(`2 dig verificador: ${11 - resto} > 9 entao ${this.dtRows.cpf[9]} = 0`);
        console.log(`2 dig verificador: ${11 - resto} < 9 entao ${this.dtRows.cpf[9]} = ${11 - resto}`);
        if(11 - resto > 9) {
            if(parseInt(this.dtRows.cpf[10]) != 0) {
                isValid = 0;
            }
        } else {
            if((11 - resto) != parseInt(this.dtRows.cpf[10])) {
                isValid = 0;
            }
        }

        if(this.dtRows.cpf == '99999999999') {
            isValid = 0;
        }
        return isValid;
    }

    abrirTermos() {
        utils.openUrl("http://18.222.201.187/terms/terms.html");
    }

    closeWebView() {
        this.webViewInstaEnabled = false;
    }

}
