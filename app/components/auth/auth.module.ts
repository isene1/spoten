import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
// import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
// import { HomeComponent } from "../home/home.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AuthComponent,
        // HomeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class AuthModule { }
