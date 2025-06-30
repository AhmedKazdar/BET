import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
      private tokenService: TokenService,
      private router: Router
  ) { }

  intercept(
      request: HttpRequest<unknown>,
      next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
      let req = request.clone();
      if (!req.url.includes('/login') && !req.url.includes('/img.png') && !req.url.includes('103.228.112.83')) {
          let token = this.tokenService.getToken();
          if (token) {
              req = request.clone({
                  setHeaders: { Authorization: this.tokenService.getToken() },
              });
          } else {
              this.tokenService.removeToken();
              //   this.router.navigate(['/login']);
              // window.location.href = "highlight";

          }
      }
      return next.handle(req).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {

                  // if (event.url.indexOf('ping') > -1) {
                  //   if (!event.body) {
                  //     this.router.navigate(['/login']);
                  //   }
                  // }
                  // console.log(event.body)
                  // if (!event.body) {
                  //   this.router.navigate(['/login']);
                  // }
                  if (
                      event?.body?.errorDescription
                          ?.toLowerCase()
                          .includes('no session') ||
                      event?.body?.errorDescription
                          ?.toLowerCase()
                          .includes('session expired')
                  ) {
                      this.tokenService.removeToken();
                      // this.router.navigate(['/login']);
                      // window.location.href = "highlight";

                  }
              }
              return event;
          })
      );
  }
}
