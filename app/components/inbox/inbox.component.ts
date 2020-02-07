import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
import { confirm } from "tns-core-modules/ui/dialogs";
import { Inbox } from "~/shared/inbox/inbox";
import { InboxService } from "~/shared/inbox/inbox.service";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
    selector: "inbox",
    providers: [
        InboxService,
        AuthService
    ],
    moduleId: module.id,
    templateUrl: "./inbox.component.html",
    styleUrls: ['./inbox.component.css']
})


export class InboxComponent extends ClasseBase implements OnInit {
    
    private _dataInbox: ObservableArray<Inbox> = new ObservableArray<Inbox>();
    isLoading: boolean = false;
    userId: number;
    
    constructor(
        router: Router, 
        private page: Page,
        private inboxService: InboxService,
        private authSvc: AuthService
    ) {
        super(router);
        this.userId = this.authSvc.getUserId()["appuserId"];
    }

    ngOnInit(): void {
        this.getRows();
        this.isLoading = true;
    }

    getRows() {
        console.log(this.userId);
        this.inboxService.getRows(this.userId) // statico posteriormente colocar o id do usuario
           .subscribe(
               (loadedRows) => {
                    this._dataInbox = loadedRows;
                    this.isLoading = false;
               },
               () => {
                alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }

    get dataInbox(): ObservableArray<Inbox> {
        return this._dataInbox;
    }

    check(obj: Inbox) {
        //console.log(obj);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "idEmp": obj.empresaId,
                "idInbox": obj.inboxId,
            }
        };
        this.router.navigate(["./resgate/"], navigationExtras);
    }
}
