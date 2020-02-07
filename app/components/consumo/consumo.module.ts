import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ConsumoComponent } from "~/components/consumo/consumo.component";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { FilterPipe } from "./FilterPipe";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        ConsumoComponent,
        FilterPipe
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class ConsumoModule {}
