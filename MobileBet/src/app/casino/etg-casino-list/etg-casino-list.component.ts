import { Component, OnInit, ViewChild } from '@angular/core';
// import Swiper core and required modules
import SwiperCore, { SwiperOptions } from 'swiper';
import { SwiperComponent } from "swiper/angular";

@Component({
  selector: 'app-etg-casino-list',
  templateUrl: './etg-casino-list.component.html',
  styleUrls: ['./etg-casino-list.component.scss']
})
export class EtgCasinoListComponent implements OnInit {

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 1,
    // autoplay:true,
    // navigation: true,
    // pagination: { clickable: true },
    // scrollbar: { draggable: true },
  };
  constructor() { }

  ngOnInit(): void {
  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    // console.log('slide change');
  }
  slideNext(){
    this.swiper.swiperRef.slideNext(100);
  }
  slidePrev(){
    this.swiper.swiperRef.slidePrev(100);
  }
}
