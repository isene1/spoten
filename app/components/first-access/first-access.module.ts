import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DropDownModule } from "nativescript-drop-down/angular";
import { MaskedTextFieldModule } from "nativescript-masked-text-field/angular"

import { FirstAccessComponent } from "~/components/first-access/first-access/first-access.component";
import { WelcomeComponent } from "~/components/first-access/welcome/welcome.component";
import { ChoiceCityComponent } from "~/components/first-access/choice-city/choice-city.component";
import { CongratsComponent } from "~/components/first-access/congrats/congrats.component";
import { CadastrarComponent } from "~/components/first-access/cadastrar/cadastrar.component";
import { EmAltaModule } from "~/components/em-alta/em-alta.module";

// Diretiva do plugin de slider
import { CarouselDirective } from "nativescript-ng2-carousel";
// Diretiva do plugin gridview
import { GridViewModule } from "nativescript-grid-view/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        EmAltaModule,
        DropDownModule,
        GridViewModule,
        MaskedTextFieldModule
    ],
    declarations: [
        FirstAccessComponent,
        WelcomeComponent,
        ChoiceCityComponent,
        CongratsComponent,
        CadastrarComponent,
        CarouselDirective
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class FirstAccessModule { }
