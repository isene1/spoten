import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { BarraMenuModule } from "../barra-menu/barra-menu.module";
import { ResgateComponent } from "./resgate.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule
    ],
    declarations: [
        ResgateComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        
    ]
})


export class ResgateModule { }
