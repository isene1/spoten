import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { EmAltaComponent } from "~/components/em-alta/em-alta.component";
import { SpotsDobradosModule } from "~/components/spots-dobrados/spots-dobrados.module";
import { MelhoresCidadeModule } from "~/components/melhores-cidade/melhores-cidade.module";
import { ExclusivVoceModule } from "~/components/exclusiv-voce/exclusiv-voce.module";
import { BarraMenuModule } from "~/components/barra-menu/barra-menu.module";
import { InboxModule } from "~/components/inbox/inbox.module";
import { EstabelecimentoModule } from "~/components/estabelecimento/estabelecimento.module";
import { CashbackModule } from "~/components/cashback/cashback.module";
import { ConsumoModule } from "~/components/consumo/consumo.module";
import { BuscaModule } from "~/components/busca/busca.module";
import { CategoriaModule } from "~/components/categorias/categoria.module";
import { ResgateModule } from "~/components/resgate/resgate.module";
import { AvaliacaoModule } from "~/components/avaliacao/avaliacao.module";
import { RegistraConsumoModule } from "~/components/registra-consumo/registra-consumo.module";
import { PerfilModule } from "~/components/perfil/perfil.module";
import { MapaModule } from "~/components/mapa/mapa.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        BarraMenuModule,
        SpotsDobradosModule,
        MelhoresCidadeModule,
        ExclusivVoceModule,
        InboxModule,
        EstabelecimentoModule,
        CashbackModule,
        ConsumoModule,
        BuscaModule,
        CategoriaModule,
        ResgateModule,
        AvaliacaoModule,
        RegistraConsumoModule,
        PerfilModule,
        MapaModule
    ],
    declarations: [
        EmAltaComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})


export class EmAltaModule { }
