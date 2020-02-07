import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";
import { ClasseBase } from "~/shared/classeBase";
const firebase = require("nativescript-plugin-firebase");
import { AuthService } from "~/shared/auth/auth.service";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "first-access",
    providers: [
        AuthService
    ],
    moduleId: module.id,
    templateUrl: "./first-access.component.html",
})


export class FirstAccessComponent extends ClasseBase implements OnInit {

    protected images: any = [];
    isLoading: boolean = true;
    
    constructor(router: Router, private page: Page, private authSvc: AuthService, private routerExtentions: RouterExtensions) {
        super(router);
        this.images=[
            { title: 'Image 1', file: '~/components/first-access/first-access/imgs/arhitektura-mosty-40105.jpg' },
            { title: 'Image 2', file: '~/components/first-access/first-access/imgs/arhitektura-pejzazh-41104.jpg' },
            { title: 'Image 3', file: '~/components/first-access/first-access/imgs/arhitektura-zamki-40753.jpg' },
        ];
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        firebase.getCurrentUser()
        .then(user => {
            if(user) {
                this.authSvc.setUserId(user.email).subscribe(() =>{
                    if(this.authSvc.getUserId()["appuserId"] != null && this.authSvc.getUserId()["appuserId"] != undefined) {
                        console.log(`id do usuario: ${this.authSvc.getUserId()["appuserId"]}`);
                        this.isLoading = false;
                        this.routerExtentions.navigate(["./em_alta"], { clearHistory: true});
                    } else {
                        return;
                    }
                });
            }
            else {
                console.log("no user");
                this.isLoading = false;
                this.navigate("/auth");
            }
        })
        .catch(error => console.log("Trouble in paradise: " + error));
    }

}
