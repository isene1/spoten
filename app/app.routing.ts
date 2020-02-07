import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { FirstAccessComponent } from "~/components/first-access/first-access/first-access.component";
import { WelcomeComponent } from "~/components/first-access/welcome/welcome.component";
import { ChoiceCityComponent } from "~/components/first-access/choice-city/choice-city.component";
import { CongratsComponent } from "~/components/first-access/congrats/congrats.component";
import { CadastrarComponent } from "~/components/first-access/cadastrar/cadastrar.component";
import { EmAltaComponent } from "~/components/em-alta/em-alta.component";
import { SpotsDobradosComponent } from "~/components/spots-dobrados/spots-dobrados.component";
import { MelhoresCidadeComponent } from "~/components/melhores-cidade/melhores-cidade.component";
import { ExclusivVoceComponent } from "~/components/exclusiv-voce/exclusiv-voce.component";
import { InboxComponent } from "~/components/inbox/inbox.component";
import { AuthComponent } from "./components/auth/auth.component";
import { EstabelecimentoComponent } from "~/components/estabelecimento/estabelecimento.component";
import { CashbackComponent } from "~/components/cashback/cashback.component";
import { ConsumoComponent } from "~/components/consumo/consumo.component";
import { BuscaComponent } from "~/components/busca/busca.component";
import { CategoriaComponent } from "~/components/categorias/categoria.component";
import { ResgateComponent } from "~/components/resgate/resgate.component";
import { AvaliacaoComponent } from "~/components/avaliacao/avaliacao.component";
import { RegistraConsumoComponent } from "~/components/registra-consumo/registra-consumo.component";
import { PerfilComponent } from "~/components/perfil/perfil.component";

import { MapaComponent } from "~/components/mapa/mapa.component";

import { RecuperarSenha } from "~/components/recuperar-senha/recuperar-senha.component";


const routes: Routes = [
    { path: "", redirectTo: "/first_access", pathMatch: "full" },
    //{ path: "", redirectTo: "/em_alta", pathMatch: "full" },
    { path: "auth", component: AuthComponent},
    { path: "recuperar_senha", component: RecuperarSenha },
    { path: "first_access", component: FirstAccessComponent },
    { path: "welcome", component: WelcomeComponent},
    { path: "welcome/:c", component: WelcomeComponent},     // para quando voltar da tela de escolha de cidade
    { path: "choice_city", component: ChoiceCityComponent},
    { path: "congrats", component: CongratsComponent},
    { path: "cadastrar", component: CadastrarComponent},
    { path: "em_alta", component: EmAltaComponent},
    { path: "spots_dobr", component: SpotsDobradosComponent },
    { path: "melhores", component: MelhoresCidadeComponent },
    { path: "exclusivos", component: ExclusivVoceComponent },
    { path: "inbox", component: InboxComponent },
    { path: "estabelecimento", component: EstabelecimentoComponent },
    { path: "cashback", component: CashbackComponent },
    { path: "consumo", component: ConsumoComponent },
    { path: "busca", component: BuscaComponent },
    { path: "categoria", component: CategoriaComponent },
    { path: "resgate", component: ResgateComponent},
    { path: "avaliacao", component: AvaliacaoComponent },
    { path: "registra_consumo", component: RegistraConsumoComponent },
    { path: "perfil", component: PerfilComponent },
    { path: "mapa", component: MapaComponent }
];


@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})

export class AppRoutingModule { }
