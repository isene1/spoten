import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { MapaComponent } from "./mapa.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        BarraMenuModule,
    ],
    declarations: [
        MapaComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class MapaModule{}