import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { BuscaComponent } from "~/components/busca/busca.component";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        BuscaComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class BuscaModule {}