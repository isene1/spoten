import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { BarraMenuComponent } from "~/components/barra-menu/barra-menu.component";



@NgModule({
    imports: [
        NativeScriptCommonModule
    ],
    declarations: [
        BarraMenuComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    exports: [
      BarraMenuComponent
    ]
})


export class BarraMenuModule { }
