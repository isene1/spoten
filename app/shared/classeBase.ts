import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";


export class ClasseBase {
    router: Router;

    constructor( routerP: Router){
        this.router = routerP;
    }

    navigate(destino): void {
        this.router.navigate([destino]);
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }



}