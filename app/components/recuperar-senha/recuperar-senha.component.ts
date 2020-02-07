import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { TextField } from "tns-core-modules/ui/text-field";
const firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "recuperar-senha",
    providers: [],
    moduleId: module.id,
    templateUrl: "./recuperar-senha.component.html"
})


export class RecuperarSenha implements OnInit {

    emailCliente: string = '';
    provider: string = '';

    constructor(private page: Page) {}

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    verificar(): void {
        console.log(this.emailCliente);
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(pattern.test(this.emailCliente)) {
            firebase.resetPassword({
                email: this.emailCliente
            }).then(
                function () {
                    //console.log(`o email a ser verificado é: ${this.emailCliente}`);
                    alert(`Verifique o seu e-mail para a recuperação de senha.`);
                },
                function (errorMessage) {
                    console.log(errorMessage);
                }
            );
        } else {
            alert("Favor verifique o email digitado.");
        }
    }
}