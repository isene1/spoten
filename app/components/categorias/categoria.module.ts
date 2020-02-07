import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { CategoriaComponent } from "~/components/categorias/categoria.component";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { DropDownModule } from "nativescript-drop-down/angular";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
        DropDownModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        CategoriaComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class CategoriaModule {}
