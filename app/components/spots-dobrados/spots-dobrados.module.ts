import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SpotsDobradosComponent } from "~/components/spots-dobrados/spots-dobrados.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { BarraMenuModule } from "../barra-menu/barra-menu.module";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptUIListViewModule,
        BarraMenuModule, 
    ],
    declarations: [
        SpotsDobradosComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        
    ]
})


export class SpotsDobradosModule { }
