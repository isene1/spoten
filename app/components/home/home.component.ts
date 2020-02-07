import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "ui/page";


@Component({
    selector: "home",
    providers: [

    ],
    moduleId: module.id,
    templateUrl: "./home.component.html"
})


export class HomeComponent implements OnInit {

    constructor(private router: Router, private page: Page) {
    }

    ngOnInit(): void {
    }

    navigate(loc): void {
        this.router.navigate([loc]);
    }
    

}
