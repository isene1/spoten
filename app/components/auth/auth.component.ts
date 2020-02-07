import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Auth } from "../../shared/auth/auth";
import { AuthService } from "../../shared/auth/auth.service";
import { Page } from "ui/page";
const firebase = require("nativescript-plugin-firebase");
import { RouterExtensions } from "nativescript-angular/router";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";

@Component({
    selector: "auth",
    providers: [
        AuthService
    ],
    moduleId: module.id,
    templateUrl: "./auth.component.html"
})


export class AuthComponent implements OnInit {
    user: Auth;

    @ViewChild("authWebView") webViewRef: ElementRef;
    webViewInstaEnabled: boolean = false;
    instagramClientId = "f754cc2ca2dc4a598ff746223982ed5c";
    public webViewSrc: string = '';
    stateWebView: string = "first_time";

    constructor(private authSvc: AuthService, private router: Router, private page: Page, private routerExtentions: RouterExtensions) {
        this.user = new Auth();
        this.user = {
            Username: '',
            Password: '',
            Senha: '',
        }
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        const appSettings = require("application-settings");
        var usName = appSettings.getString("Username");
        var usSenha = appSettings.getString("Senha");
        // usName = "";
        // usName = "";
        // usSenha = "";
        if (usName == undefined || usName == '' || usSenha == undefined || usSenha == '') {
            { };
        } else {
            this.user.Username = usName;
            this.user.Senha = usSenha;
            // this.login();
        }
        firebase.init({
            // options
        }).then(
            instance => {
                // console.log("firebase init done");
                // this.getSex();
                console.log(`firebase init succes`);
            },
            error => {
                console.log(`firebase.init error: ${error}`);
                console.log(`FIREBASE: ${error}`);
            }
        );
    }

    login(): void {
        console.log("login funtion");
        firebase.login(
            {
              type: firebase.LoginType.PASSWORD,
              passwordOptions: {
                email: this.user.Username,
                password: this.user.Senha
              }
            })
            .then(result => {
                this.authSvc.setUserId(result.email).subscribe(() =>{
                    if(this.authSvc.getUserId()["appuserId"] != null && this.authSvc.getUserId()["appuserId"] != undefined) {
                        console.log(`id do usuario: ${this.authSvc.getUserId()["appuserId"]}`);
                        this.routerExtentions.navigate(["./em_alta"], { clearHistory: true});
                    } else {
                        alert("Faça o cadastro primeiramente");
                        return;
                    }
                });
            })
            .catch(error => {alert("Ocorreu um erro em sua tentativa de login. Por favor verifique sua conexão com a internet ou tente novamente mais tarde")});
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
                this.authSvc.setUserId(result.email).subscribe(() =>{
                    if(this.authSvc.getUserId()["appuserId"] != null && this.authSvc.getUserId()["appuserId"] != undefined) {
                        console.log(`id do usuario: ${this.authSvc.getUserId()["appuserId"]}`);
                        this.routerExtentions.navigate(["./em_alta"], { clearHistory: true});
                    } else {
                        alert("Faça o cadastro primeiramente");
                        return;
                    }
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
            
            if(accessToken) {
                if(this.stateWebView == "first_time") {
                    console.log(`access token: ${accessToken}`);
                    this.webViewInstaEnabled = false;
                    this.authSvc.getUserInstagram(accessToken)
                        .subscribe(
                            (loadedRows) => {
                                userName = loadedRows.data.username;
                                if(userName) {
                                    let email = userName + "@email.com";
                                    console.log("email: " + email);
                                    this.authSvc.verificaEmailCadastrado(email).subscribe((loadedRows) => {
                                        console.log(loadedRows);
                                        if(loadedRows == 'empty') {
                                            alert("Você ainda não está cadastrado.\nFavor proceder com o cadastro.");
                                        } else if (loadedRows == "contem") {
                                            this.authSvc.setUserId(email).subscribe(() => {
                                                this.closeWebView();
                                                this.routerExtentions.navigate(["./em_alta"], { clearHistory: true});
                                            });
                                        }
                                    });
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

    cadastrar(): void {
        this.router.navigate(["/welcome"]);
    }

    recuperarSenha(): void {
        console.log("route to recuperar");
        this.router.navigate(["recuperar_senha"])
    }

    closeWebView() {
        this.webViewInstaEnabled = false;
    }
}
