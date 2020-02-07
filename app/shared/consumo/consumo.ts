export class Consumo {
    _data_consumo: Date;
    _valor: number;
    _empresaId: number;
    _appuserId: number;
    //campanhaId: number; // verificar no servidor
    _aval_01: number;
    _aval_02: number;
    _aval_03: number;
    _aval_04: number;

    constructor() {}

    set dataConsumo (data_consumo: Date) {
        this._data_consumo = data_consumo;
    }

    set valor (valor: number) {
        this._valor = valor;
    }

    set empresaId (empresaId: number) {
        this._empresaId = empresaId;
    }

    set appuserId (appuserId: number) {
        this._empresaId = appuserId;
    }

    set aval01 (aval01: number) {
        this._aval_01 = aval01;
    }

    set aval02 (aval02: number) {
        this._aval_02 = aval02;
    }

    set aval03 (aval03: number) {
        this._aval_03 = aval03;
    }

    set aval04 (aval04: number) {
        this._aval_04 = aval04;
    }
}