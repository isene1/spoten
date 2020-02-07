import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActivatedRoute, Router } from '@angular/router';
const firebase = require("nativescript-plugin-firebase");


@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent implements OnInit { 
    constructor(private _router: Router, private routerExtentions: RouterExtensions) { }

    ngOnInit() {
        
    }

    public onNavigationItemTap(args: any) {
        // const itemIndex = args.index;
        // const tappedItem = this._currentExample.subItems[itemIndex];
        // const sideDrawer = <RadSideDrawer>app.getRootView();
        // sideDrawer.closeDrawer();
        // if (tappedItem.subItems.length === 0) {
        //   this._router.navigateByUrl(tappedItem.path);
        // } else {
        //   this._router.navigate(['/examples-depth-2', this._currentExample.title, tappedItem.title]);
        // }
    }

    navigate(param) {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
        this._router.navigate([param]);
    }

    fechaSideDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    logout() {
        firebase.logout();
        this.routerExtentions.navigate(["/first_access"], { clearHistory: true});
        this.fechaSideDrawer();
    }
 }
