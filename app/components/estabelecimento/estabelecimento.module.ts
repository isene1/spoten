import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { BarraMenuModule } from "../barra-menu/barra-menu.module";
import { EstabelecimentoComponent } from "./estabelecimento.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptUIListViewModule,
        BarraMenuModule
    ],
    declarations: [
        EstabelecimentoComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        
    ]
})


export class EstabelecimentoModule { }
