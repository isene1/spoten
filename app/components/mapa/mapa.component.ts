import {Component, ViewChild, OnInit} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { ClasseBase } from "~/shared/classeBase";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest } from "nativescript-geolocation";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

import { MapaService } from "~/shared/mapa/mapa.service";
// Important - must register MapView plugin in order to use in Angular templates
registerElement('MapView', () => MapView);

@Component({
    moduleId: module.id,
    selector: 'mapa',
    providers: [ MapaService ],
    templateUrl: 'mapa.component.html',
})
export class MapaComponent extends ClasseBase implements OnInit {

    isLoading: boolean = false;
    latitude =  0;
    longitude = 0;
    zoom = 15;
    minZoom = 5;
    maxZoom = 20;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    mapView: MapView;

    lastCamera: String;

    estabelecimentos: any[];

    constructor(router: Router, private mapaSvc: MapaService) {
        super(router);
    }
    
    ngOnInit() {
        this.verifyGeoLocationEnabled();
    }

    getRows(lat: number, lon: number) {
        this.mapaSvc.getRows(lat, lon) 
           .subscribe(
               (loadedRows) => {
                    this.estabelecimentos = loadedRows;
                    this.carregaLocais();
                    this.isLoading = false;
               },
               () => {
                alert("Não foi possível carregar a lista de estabelecimentos. Verifique a conexão com a internet");
                   this.isLoading = false;
               }
        );
    }

    //Map events
    onMapReady(event) {
        this.mapView = event.object;
        this.mapView.clear();
    }

    onCameraChanged(args) {
        console.log("Camera changed: " + JSON.stringify(args.camera)); 
        this.getRows(args.camera.latitude, args.camera.longitude);
    }

    carregaLocais() {
        let cont = 1;
        this.estabelecimentos.forEach(element => {
            console.log(element.nome_fantasia);
            var marker = new Marker();
            marker.position = Position.positionFromLatLng(element.latitude, element.longitude);
            marker.title = element.nome_fantasia;
            marker.userData = {index: cont}
            cont++;
            this.mapView.addMarker(marker);
        });
    }

    openDrawer() {
        let sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    // geolocalizacao
    verifyGeoLocationEnabled() {
        //
        isEnabled().then(
            (locationIsEnabled) => {
                if (locationIsEnabled != true) {
                    this.askForGeolocation();
                } else {
                    console.log("Servicos de localizacao habilitados");
                    this.isLoading = true;
                    // buscar localizacao
                    this.queryCurrentLocation();
                }
            }, 
            (notEnabled) => {
                console.log("disabled");
                // console.log("this code seems to never be reached");
            }
        );

    }

    askForGeolocation() {
        // enableLocationRequest(true);
        enableLocationRequest(true).then(
            (accepted) => {
                console.log("Aceito");
                this.queryCurrentLocation();
            },
            (rejected) => {
                console.log("Rejeitado");
                // 
            }
        );
    }

    queryCurrentLocation() {
        this.isLoading = true;
        getCurrentLocation({'desiredAccuracy': 3, 'updateDistance': 10, 'maximumAge': 20000, 'timeout': 20000}).then(
            (location) => {
                console.log("Buscou localizacao");
                console.log("Current location is: " + location.latitude + ", " + location.longitude);
                this.latitude = location.latitude;
                this.longitude = location.longitude;
                this.getRows(this.latitude, this.longitude);
            },
            (rejeitado) => {
                console.log("Nao conseguiu localizacao");
                alert("Não foi possível trazer sua localização");
                this.isLoading = false;
            }
        );
    }
}