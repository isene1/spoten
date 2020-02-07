import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { RecuperarSenha } from "./recuperar-senha.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule
    ],
    declarations: [
        RecuperarSenha
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class RecuperarSenhaModule { }