import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeSearch'
})
export class PipeSearchPipe implements PipeTransform {

  transform(value: any, searchValue: any): any {

    if (!searchValue) return value;
    return value.filter((v: any) => v.CONSECUTIVO.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || v.TIPODEFALLA.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    || v.ESTADO.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ) 
    


  }
  
}
