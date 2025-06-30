import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-casinoproduct',
  templateUrl: './casinoproduct.component.html',
  styleUrls: ['./casinoproduct.component.scss']
})
export class CasinoproductComponent implements OnInit {

  constructor(
    private reportService: ReportService,

  ) { }

  ngOnInit(): void {
    this.getCasinoProduct()
  }

  getCasinoProduct() {
    this.reportService.CasinoProduct().subscribe(
      (resp: any) => {
        console.log(resp);

      }

    );
  }

}
