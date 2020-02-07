import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
//import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HomeComponent } from "./home.component";


@NgModule({
    imports: [
        NativeScriptCommonModule
    ],
    declarations: [
        HomeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class HomeModule { }
