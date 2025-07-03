import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientApiService } from 'src/app/services/client-api.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-fancy-book',
  templateUrl: './fancy-book.component.html',
  styleUrls: ['./fancy-book.component.scss']
})
export class FancyBookComponent implements OnInit {

  fancyBookData: any;
  fancyName;

  constructor(
    private userService: ClientApiService,
    private route: ActivatedRoute,
    private main: MainService,

  ) {

    this.route.queryParams.subscribe((params) => {
      // console.log(params)
      this.main.apis$.subscribe((res) => {
        this.getFancyBook(params);
      });
    })
    // this.route.params.subscribe(params => {
    //   // console.log(params);

    //   this.main.apis$.subscribe((res) => {
    //     this.getFancyBook(params);
    //   });
    // })
  }

  ngOnInit(): void {
  }

  getFancyBook(fancy) {
    this.fancyBookData = [];

    this.fancyName = fancy.nat;
    this.userService
      .getFancyBook(fancy.mid, fancy.sid, fancy.nat)
      .subscribe((books: any) => {
        if (books.result.length == 0) {
          return;
        }
        let matrix = (<string>Object.values(books.result[0])[0])
          .replace(/\{|\}/g, '')
          .split(',')
          .map((f) => {
            return f.split(':').map((b: any) => (b = +b));
          });
        // console.log(matrix)

        for (let i = 0; i < matrix.length; i++) {
          let run = matrix[i][0];
          let row = [];
          if (i === 0) {
            row[0] = run + ' and below';
          } else if (i === matrix.length - 1) {
            row[0] = matrix[i - 1][0] + 1 + ' and above';
          } else if (matrix[i - 1][0] + 1 === matrix[i][0]) {
            row[0] = matrix[i][0];
          } else {
            row[0] = matrix[i - 1][0] + 1 + '-' + matrix[i][0];
          }
          row[1] = matrix[i][1];
          this.fancyBookData.push(row);
        }

        $('#fancyBetBookLeftSide').css("display", "flex");
        $('#sideWrap').addClass("left-in");
        setTimeout(() => {
          $('#sideWrap').removeClass("left-in");
        }, 1000);

        // console.log(this.fancyBookData)
      });
  }

}
