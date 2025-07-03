import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import 'firebase/auth';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ClientApiService } from '../services/client-api.service';


interface NonceResponse {
  nonce: string;
}
interface VerifyResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAffiliate = environment.isAffiliate
  user: any;
  appVerifier: any;
  confirmationResult:any;
  siteName = environment.siteName;
  b2cID: any;
  constructor(private router: Router, private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service, private fireAuth: AngularFireAuth, private tokenService: TokenService, public toastr: ToastrService, private db: AngularFireDatabase, private loginService: LoginService, private clientApi: ClientApiService
  ) { 
    this.fireAuth.authState.subscribe(user=>{
      if(user){
        console.log(user.email);
      }
      else{
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
    this.clientApi.getb2cid().subscribe((resp:any)=>{
      if(resp){
      this.b2cID = resp.result[0].b2cID;
      }
    })

  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  GoogleAuth(type: any) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.AuthLogin(provider, type);
  }

  FacebookAuth(type: any) {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.AuthLogin(provider, type);
  }

  async SignOut() {
    await this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  SetUserData(user: any) {     
    this.db.database.ref('users').child(user.username).set({
      email: user.email,
      username: user.username,
      password:user.password,
      dob: user.dob,
      phoneno: user.phoneno,
      currency:user.currency
    });
  }

  async SignUp(userData:any) {
    try {
      const result = await this.fireAuth.createUserWithEmailAndPassword(userData.email, userData.password);
      if(result.user){
        userData.firebaseId = result.user.uid;
        this.loginService
        .register(userData)
        .subscribe((resp: any) => {
          if (resp.errorCode === 0) {
            this.SendVerificationMail();
            if(this.isAffiliate  && this.tokenService.getClickID() != null && this.tokenService.getClickID()!='undefined'){
              let affData = {
                user_id:resp.result[0].userId,
                click_id:this.tokenService.getClickID(),
                aff_id:this.tokenService.getAffId(),
                offer_id:this.tokenService.getOfferId(),
                siteName:this.siteName
              }
              this.sendAffData(affData);
            }
           
          } else {
            this.toastr.error(resp.errorDescription);
            this.SignOut()
          }
          $('#login_loading').css('display', 'none');
        }, err => {
          $('#login_loading').css('display', 'none');
        }
        );
      }
    } catch (e) {
      if (e.code == 'auth/account-exists-with-different-credential' || e.code == 'auth/email-already-in-use') {
        this.toastr.error("Email already in use by another account");
        $('#login_loading').css('display', 'none');
      }
    }
  }

  async SignInWithEmail(userData:any,type:any) {
    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(userData.userName, userData.password);
      if(result.user){
        if(result.user.emailVerified){
          this.loginService
            .login(userData)
            .subscribe((resp: any) => {
              if (resp.errorCode === 0) {
                this.tokenService.setToken(resp.result[0].token);
                this.tokenService.setUserInfo(resp.result[0]);
                // this.router.navigate(['highlight']);
                // window.location.href = "home";
                window.location.href = window.location.origin + window.location.pathname;
              } else {
                if (!resp.errorDescription) {
                  resp.errorDescription = "Username or password is wrong"
                }
                this.SignOut()
                this.toastr.error(resp.errorDescription);
              }
              $('#login_loading').css('display', 'none');
            }
            );
        }
        else{
          $('#login_loading').css('display', 'none');
          this.toastr.error("Email Address is not Verified");
          this.SignOut();
        }
      }
    } catch (e) {
      if (e.code == 'auth/user-not-found') {
        this.toastr.error("User Not Found");
      }
      if(e.code=='auth/wrong-password'){
        this.toastr.error("Invalid Password");
      }
    }
  }

  async SendVerificationMail() {
    return this.fireAuth.currentUser
      .then((user) => {
        return user.sendEmailVerification();
      })
      .then(() => {
        this.router.navigate(['/highlight']).then(()=>{
          $('#verifyEmail').css('display', 'block');
        });
      });
  }


  async AuthLogin(provider:any,type:any) {
    try {
      const result = await this.fireAuth.signInWithPopup(provider);
      provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
      if(type==0){
        this.RegisterWithSocial(result.user,0,this.b2cID);
      }
      else{
        this.Login(result.user);
      }
    } catch (e) {
      if (e.code == 'auth/account-exists-with-different-credential') {
        var email = e.email;
        var pendingCredential = e.credential;
        this.fireAuth.fetchSignInMethodsForEmail(email).then((methods) =>{
          if (methods[0] === 'password') {
            // var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
            this.fireAuth.signInWithEmailAndPassword(email, 'password').then((result_2:any) =>{
              // Step 4a.
              result_2.user.linkWithCredential(pendingCredential);
              this.Login(result_2.user);
            })
            return;
          }
          if(methods[0]==='google.com'){
           this.toastr.error('You already have an account with the selected email address.');
            this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result:any)=> {
              result.user.linkAndRetrieveDataWithCredential(pendingCredential);
              this.Login(result.user);
            });
          return;
          }
          if(methods[0]==='facebook.com'){
            this.toastr.error('You already have an account with the selected email address.');
            this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((result:any) =>{
              result.user.linkAndRetrieveDataWithCredential(pendingCredential);
              this.Login(result.user);
            });
          return;
          }          
        });
      }
    }
  }
  sendAffData(affData:any){
    this.loginService.addAffUser(affData).subscribe((resp: any)=>{
      if (resp.status !='Success') {
        this.sendAffData(affData);
      }
    })
  }

  async RegisterWithSocial(user:any,type:any,b2cID:any) {
    let userData ={
      firstName:user.displayName!=null ?user.displayName.split(' ')[0]:"",
      lastName:user.displayName!=null ?user.displayName.split(' ')[1]:"",
      userName: "",
      password: "",
      currencyCode: environment.currency,
      email: user.email!=null? user.email:"",
      b2cID: b2cID,
      phoneNumber: user.phoneNumber==null?"":user.phoneNumber,
      address:"",
      birthDate: user.birthDate!=null?user.birthDate:"",
      firebaseId:user.uid,
      blocChain:"",
      domain:environment.origin,
      isb2c:1
    }
    console.log(userData);
     this.loginService.register(userData).subscribe((resp: any) => {
      console.log(resp);
      // if (resp.errorCode === 0) {
      //  if(type==0){
      //   if(user.email!=null||user.email==""){
      //     let data={"email":user.email,"siteName":environment.siteName,"domain":environment.domain}
      //     this.loginService.sendWelcomeMail(data).subscribe((resp:any)=>{console.log(resp.status)});
      //   }
        
      //   this.toastr.success('Registered Successfully');
      //   this.tokenService.setToken(resp.result[0].token);
      //   this.tokenService.setUserInfo(resp.result[0]);
      //   window.location.href = window.location.origin + window.location.pathname;
      //  }
     
      // } else {
      //   this.SignOut()
      //   this.toastr.error(resp.errorDescription);
      // }
      if (resp.errorCode === 0) {
       
        if(this.isAffiliate  && this.tokenService.getClickID() != null  && this.tokenService.getClickID()!='undefined'){
         let affData = {
           user_id:resp.result[0].userId,
           click_id:this.tokenService.getClickID(),
           aff_id:this.tokenService.getAffId(),
           offer_id:this.tokenService.getOfferId(),
           siteName:this.siteName
         }
         this.sendAffData(affData);
       }else{
         if(type==0){
           if(user.email!=null||user.email==""){
             let data={"email":user.email,"siteName":environment.siteName,"domain":environment.domain}
             this.loginService.sendWelcomeMail(data).subscribe((resp:any)=>{console.log(resp.status)});
           }
           this.toastr.success('Registered Successfully');
           this.tokenService.setToken(resp.result[0].token);
           this.tokenService.setUserInfo(resp.result[0]);
           window.location.href = window.location.origin + window.location.pathname;
          }
       }
       } else {
         this.SignOut()
         this.toastr.error(resp.errorDescription);
       }
      $('#login_loading').css('display', 'none');
    }, err => {
      this.SignOut()
      console.log(err);
    }
    );
  }

  Login(user:any) {
    let body = {
      userName: user.username!=null?user.username:"",
      password: user.password!=null?user.password:"",
      firebaseId:user.uid,
      captcha: '0000',
      log: '0000',
      origin:environment.origin
    }
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      if(token!=null || token!=""){
          this.loginService.login(body)
                .subscribe((resp: any) => {
                  if (resp.errorCode === 0) {
                    this.toastr.success("Login Successfully");
                    this.tokenService.setToken(resp.result[0].token);
                    this.tokenService.setUserInfo(resp.result[0]);
                    window.location.href = window.location.origin + window.location.pathname;
                    $('#login_loading').css('display', 'none');
                  } else {
                    if(resp.errorDescription==="User Not Found." || resp.errorDescription==="invalid username/password6"){
                      this.RegisterWithSocial(user,0, this.b2cID);
                    }
                  }
                  
                }, err => {
                  this.SignOut()
                  console.log(err);
                }
        );
      }
    });

  }

 async phoneLogin(phoneNumber:any,appVerifier:any){

  this.fireAuth.signInWithPhoneNumber(phoneNumber, appVerifier)
  .then(result => {
    console.log(result.confirm)
    if(result.confirm){
      this.toastr.success('OTP has been sent. Please check your phone.')
      $('#login_loading').css('display', 'none');
      this.confirmationResult = result;
    }
  })
  .catch( error => console.log(error) );
 }

 async otpSubmit(code:any,type:any,pass:any,dob:any,b2cID: any){
  this.confirmationResult.confirm(code).then(async (result) => {
    if(type==0){
      let userData ={
        firstName:result.user.displayName!=null ?result.user.displayName.split(' ')[0]:"",
        lastName:result.user.displayName!=null ?result.user.displayName.split(' ')[1]:"",
        userName: "",
        password:type==0? pass:"",
        currencyCode: environment.currency,
        email:"",
        b2cID: b2cID,
        phoneNumber: result.user.phoneNumber==null?"":result.user.phoneNumber,
        address:"",
        birthDate: type==0? dob:result.user.birthDate!=null?result.user.birthDate:"",
        firebaseId:result.user.uid,
        blocChain:"",
        domain:environment.origin,
        isb2c:1
      }
      console.log(userData);
       this.loginService.register(userData).subscribe((resp: any) => {
        console.log(resp);
        // if (resp.errorCode === 0) {
        //  if(type==0){
        //   this.toastr.success('Registered Successfully');
        //   this.tokenService.setToken(resp.result[0].token);
        //   this.tokenService.setUserInfo(resp.result[0]);
        //   window.location.href = window.location.origin + window.location.pathname;
        //  }
       
        // } else {
        //   this.SignOut()
        //   this.toastr.error(resp.errorDescription);
        // }
        if (resp.errorCode === 0) {
          if(this.isAffiliate  && this.tokenService.getClickID() != null && this.tokenService.getClickID()!='undefined'){
            let affData = {
              user_id:resp.result[0].userId,
              click_id:this.tokenService.getClickID(),
              aff_id:this.tokenService.getAffId(),
              offer_id:this.tokenService.getOfferId(),
              siteName:this.siteName
            }
            this.sendAffData(affData);
          }
         else{
          if(type==0){
            this.toastr.success('Registered Successfully');
            this.tokenService.setToken(resp.result[0].token);
            this.tokenService.setUserInfo(resp.result[0]);
            window.location.href = window.location.origin + window.location.pathname;
           }
         }
         console.log(this.tokenService.getClickID());
        
        } else {
          this.SignOut()
          this.toastr.error(resp.errorDescription);
        }
        $('#login_loading').css('display', 'none');
      }, err => {
        this.SignOut()
        console.log(err);
      }
      );
    }
    else{
     this.Login(result.user);
    }
  }).catch((error) => {
    this.toastr.error('Something Went Wrong')
    $('#login_loading').css('display', 'none');
    console.log(error);
  });
 }
  
}

