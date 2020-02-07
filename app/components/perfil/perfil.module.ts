import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { PerfilComponent } from "./perfil.component";
import { MaskedTextFieldModule } from "nativescript-masked-text-field/angular"

@NgModule({
    imports: [
        NativeScriptCommonModule,
        BarraMenuModule,
        MaskedTextFieldModule
    ],
    declarations: [
        PerfilComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    exports: []
})


export class PerfilModule { }