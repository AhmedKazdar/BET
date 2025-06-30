import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthMaintananceGuard implements CanActivate {
  constructor(private router: Router, private authService: TokenService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let isMaintanance = this.authService.getMaintanance();

    console.log(isMaintanance)

    if (isMaintanance == '1') {
      this.router.navigate(['/maintenance']);
      return false;
    } else if (isMaintanance == '2') {
      // console.log(isMaintanance)
      // // this.authService.removeToken();
      // this.router.navigate(['/dashboard']);
      return true;
    } else {
      return true;
    }

  }
}
