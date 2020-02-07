import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { CashbackComponent } from "~/components/cashback/cashback.component";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
    ],
    declarations: [
        CashbackComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class CashbackModule { }
