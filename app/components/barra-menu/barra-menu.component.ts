import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Page } from "ui/page";


@Component({
    selector: "barra-menu",
    providers: [
        
    ],
    moduleId: module.id,
    templateUrl: "./barra-menu.component.html"
})


export class BarraMenuComponent implements OnInit {
    
    constructor(
        private router: Router) {
            //
    }

    ngOnInit(): void {
        //
    }
    //

    navigate(param) {
        this.router.navigate([param]);
    }

}
