import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { DropDownModule } from "nativescript-drop-down/angular";
import { AppComponent } from "./app.component";

import { FirstAccessModule } from "~/components/first-access/first-access.module";
import { AuthModule } from "./components/auth/auth.module";
import { RecuperarSenhaModule } from "./components/recuperar-senha/recuperar-senha.module";

// import { CarouselDirective } from "nativescript-ng2-carousel";
// import { EmAltaModule } from "~/components/em-alta/em-alta.module";


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativeScriptUISideDrawerModule,
        FirstAccessModule,
        DropDownModule,
        AuthModule,
        RecuperarSenhaModule
    ],
    declarations: [
        AppComponent,
        // CarouselDirective
    ],
    providers: [
        
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    exports: [
        //CarouselDirective
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
