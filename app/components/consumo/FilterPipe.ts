import { Pipe, PipeTransform } from '@angular/core';
import { EstabelecimentoConsumo } from "~/shared/consumo/estConsumo";

@Pipe({
    name: 'estabelecimentoFilter'
})


export class FilterPipe implements PipeTransform {

    transform(items: EstabelecimentoConsumo[], searchText: string): EstabelecimentoConsumo[] {
        if (!items) return [];
        if (!searchText) return items;

        return items.filter(it => {
            return it.nome_fantasia.includes(searchText);
        });
        
    }

}