import { Injectable } from "@angular/core";


export class Config {

    private static userId: number;

    static prodFlag = true;

    static fernando = "http://192.168.1.102/spotenapi/api/v1/";
    // static fernando = "http://192.168.1.6/spotenapi/api/v1/";
    static samuel = "http://192.168.1.109/spotenapi/api/v1/";
    // static samuel = 'http://192.168.1.7/spotenapi/api/v1/';

    static prod = "http://18.222.201.187/api/v1/";

    static getCurrentApiAddrress(): string {
        if (Config.prodFlag == true) {
            return Config.prod;
        } else {
            return Config.fernando;
        }
    }

    static apiUrl = Config.getCurrentApiAddrress();


    static returnUserToken(): string {
		// const appSettings = require("application-settings");
		// var guid = appSettings.getString("Guid");
        // return guid;
        return "83ef8f33-2880-4d76-90d4-e835b7999fde";
    }

    static getUserId(){
        return this.userId;
    }

    static setUserId(id: number){
        this.userId = id;
    }
    
}