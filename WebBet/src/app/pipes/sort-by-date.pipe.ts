import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sortByDate',
  pure: true
})
export class SortByDatePipe implements PipeTransform {

  constructor(){

  }

  transform(array: any[], args: string): any {
    // console.log(array, args);
    if (typeof args[0] === "undefined") {
      return array;
    }
    array = _.sortBy(array, (a: any, b: any) => {
      return new Date(a.time);
    });
    return array;
  }

}
