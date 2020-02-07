import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ExclusivVoceComponent } from "~/components/exclusiv-voce/exclusiv-voce.component";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { BarraMenuModule } from "../barra-menu/barra-menu.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptUIListViewModule,
        BarraMenuModule
    ],
    declarations: [
        ExclusivVoceComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
    ]
})


export class ExclusivVoceModule { }
