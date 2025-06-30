import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByFancy'
})
export class OrderByFancyPipe implements PipeTransform {

  transform(array: Array<any>, fSource?: string): Array<any> {
    // console.log(array)
    // array.sort((a: any, b: any) => {
    //   if (parseInt(a.sid) < parseInt(b.sid)) {
    //     return -1;
    //   } else if (parseInt(a.sid) > parseInt(b.sid)) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    if (fSource == '0') {
      array.sort((a: any, b: any) => {
        return parseInt(a.sid) - parseInt(b.sid);
      });

      array.sort((a: any, b: any) => {
        return parseInt(a.srno) - parseInt(b.srno);
      });
    }
    return array;
  }

}
