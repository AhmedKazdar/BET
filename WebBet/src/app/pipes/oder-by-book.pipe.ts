import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByBook'
})
export class OrderByBookPipe implements PipeTransform {

  transform(array: Array<any>, args?: string): Array<any> {
    array.sort((a: any, b: any) => {
      return parseInt(a.sid) - parseInt(b.sid);
    });

    array.sort((a: any, b: any) => {
      return parseInt(a.sr) - parseInt(b.sr);
    });
    return array;
  }

}
