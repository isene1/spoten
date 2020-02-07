import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";

import { AvaliacaoComponent } from "./avaliacao.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
    ],
    declarations: [
        AvaliacaoComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class AvaliacaoModule {}