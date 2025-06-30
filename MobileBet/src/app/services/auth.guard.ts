import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

siteName = environment.siteName;
isLcRouting = environment.isLcRouting;

homeCom = '/dash';


constructor(private router: Router, private authService: TokenService) { 
  if (this.isLcRouting) {
    this.homeCom = '/home';
  }
  
}
canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {
  if (this.authService.getToken()) {
    return true;
  } else {
    this.authService.removeToken();
    this.router.navigate([this.homeCom]);
    return false;
  }

}
}
