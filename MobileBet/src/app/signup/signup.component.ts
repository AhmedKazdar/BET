import { ShareDataService } from './../services/share-data.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../socialshared/auth.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import detectEthereumProvider from '@metamask/detect-provider';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { ClientApiService } from '../services/client-api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  siteName = environment.siteName;
  isLcRouting = environment.isLcRouting;


  SignUpForm: FormGroup;
  PhoneForm: FormGroup;
  isCaptcha = environment.isCaptcha;
  visiblePassword: boolean = false;
  registerSubmitted: boolean = false;
  registerError: any
  isPendingRegister: boolean = false;
  isChecked: boolean = false;
  isPendingLogin: boolean = false;
  emailInTransit: boolean = false;
  phoneSubmitted: boolean = false;
  isPendingPhone: boolean = false;
  isPendingMetaMask: boolean = false;
  AferLoginChangePassword: boolean = environment.AferLoginChangePassword;
  selectedCountry = "+91";
  phoneError = "";
  windowRef: any;
  highCom: any;
  emailError = "";
  //EmailForm:FormGroup;
  metaData:any;
  telegramData:any;
  from:string='0';
  language: any;
  range = "en";
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  isb2c: boolean = environment.isb2c;
  isGoogle =environment.isGoogle;
  isFacebook  =environment.isFacebook;
  isTelegram  =environment.isTelegram;
  isEmail  =environment.isEmail;
  isMetamask  =environment.isMetamask;

  selectedlang: any;
  b2cID: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private main: MainService,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private shareService :ShareDataService,
    public toastr: ToastrService,
    public ngZone: NgZone,
    private loginService: LoginService,
    private tokenService: TokenService,
    private clientApi: ClientApiService,

  ) {
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
    this.highCom = '/highlight';
    window['loginViaTelegram'] = (loginData: any) => this.loginViaTelegram(loginData);

    this.getb2cID()

  }

  Countries = [{"country":"Afghanistan","code":"93","iso":"AF"},
  {"country":"Albania","code":"355","iso":"AL"},
  {"country":"Algeria","code":"213","iso":"DZ"},
  {"country":"American Samoa","code":"1-684","iso":"AS"},
  {"country":"Andorra","code":"376","iso":"AD"},
  {"country":"Angola","code":"244","iso":"AO"},
  {"country":"Anguilla","code":"1-264","iso":"AI"},
  {"country":"Antarctica","code":"672","iso":"AQ"},
  {"country":"Antigua and Barbuda","code":"1-268","iso":"AG"},
  {"country":"Argentina","code":"54","iso":"AR"},
  {"country":"Armenia","code":"374","iso":"AM"},
  {"country":"Aruba","code":"297","iso":"AW"},
  {"country":"Australia","code":"61","iso":"AU"},
  {"country":"Austria","code":"43","iso":"AT"},
  {"country":"Azerbaijan","code":"994","iso":"AZ"},
  {"country":"Bahamas","code":"1-242","iso":"BS"},
  {"country":"Bahrain","code":"973","iso":"BH"},
  {"country":"Bangladesh","code":"880","iso":"BD"},
  {"country":"Barbados","code":"1-246","iso":"BB"},
  {"country":"Belarus","code":"375","iso":"BY"},
  {"country":"Belgium","code":"32","iso":"BE"},
  {"country":"Belize","code":"501","iso":"BZ"},
  {"country":"Benin","code":"229","iso":"BJ"},
  {"country":"Bermuda","code":"1-441","iso":"BM"},
  {"country":"Bhutan","code":"975","iso":"BT"},
  {"country":"Bolivia","code":"591","iso":"BO"},
  {"country":"Bosnia and Herzegovina","code":"387","iso":"BA"},
  {"country":"Botswana","code":"267","iso":"BW"},
  {"country":"Brazil","code":"55","iso":"BR"},
  {"country":"British Indian Ocean Territory","code":"246","iso":"IO"},
  {"country":"British Virgin Islands","code":"1-284","iso":"VG"},
  {"country":"Brunei","code":"673","iso":"BN"},
  {"country":"Bulgaria","code":"359","iso":"BG"},
  {"country":"Burkina Faso","code":"226","iso":"BF"},
  {"country":"Burundi","code":"257","iso":"BI"},
  {"country":"Cambodia","code":"855","iso":"KH"},
  {"country":"Cameroon","code":"237","iso":"CM"},
  {"country":"Canada","code":"1","iso":"CA"},
  {"country":"Cape Verde","code":"238","iso":"CV"},
  {"country":"Cayman Islands","code":"1-345","iso":"KY"},
  {"country":"Central African Republic","code":"236","iso":"CF"},
  {"country":"Chad","code":"235","iso":"TD"},
  {"country":"Chile","code":"56","iso":"CL"},
  {"country":"China","code":"86","iso":"CN"},
  {"country":"Christmas Island","code":"61","iso":"CX"},
  {"country":"Cocos Islands","code":"61","iso":"CC"},
  {"country":"Colombia","code":"57","iso":"CO"},
  {"country":"Comoros","code":"269","iso":"KM"},
  {"country":"Cook Islands","code":"682","iso":"CK"},
  {"country":"Costa Rica","code":"506","iso":"CR"},
  {"country":"Croatia","code":"385","iso":"HR"},
  {"country":"Cuba","code":"53","iso":"CU"},
  {"country":"Curacao","code":"599","iso":"CW"},
  {"country":"Cyprus","code":"357","iso":"CY"},
  {"country":"Czech Republic","code":"420","iso":"CZ"},
  {"country":"Democratic Republic of the Congo","code":"243","iso":"CD"},
  {"country":"Denmark","code":"45","iso":"DK"},
  {"country":"Djibouti","code":"253","iso":"DJ"},
  {"country":"Dominica","code":"1-767","iso":"DM"},
  {"country":"Dominican Republic","code":"1-809, 1-829, 1-849","iso":"DO"},
  {"country":"East Timor","code":"670","iso":"TL"},
  {"country":"Ecuador","code":"593","iso":"EC"},
  {"country":"Egypt","code":"20","iso":"EG"},
  {"country":"El Salvador","code":"503","iso":"SV"},
  {"country":"Equatorial Guinea","code":"240","iso":"GQ"},
  {"country":"Eritrea","code":"291","iso":"ER"},
  {"country":"Estonia","code":"372","iso":"EE"},
  {"country":"Ethiopia","code":"251","iso":"ET"},
  {"country":"Falkland Islands","code":"500","iso":"FK"},
  {"country":"Faroe Islands","code":"298","iso":"FO"},
  {"country":"Fiji","code":"679","iso":"FJ"},
  {"country":"Finland","code":"358","iso":"FI"},
  {"country":"France","code":"33","iso":"FR"},
  {"country":"French Polynesia","code":"689","iso":"PF"},
  {"country":"Gabon","code":"241","iso":"GA"},
  {"country":"Gambia","code":"220","iso":"GM"},
  {"country":"Georgia","code":"995","iso":"GE"},
  {"country":"Germany","code":"49","iso":"DE"},
  {"country":"Ghana","code":"233","iso":"GH"},
  {"country":"Gibraltar","code":"350","iso":"GI"},
  {"country":"Greece","code":"30","iso":"GR"},
  {"country":"Greenland","code":"299","iso":"GL"},
  {"country":"Grenada","code":"1-473","iso":"GD"},
  {"country":"Guam","code":"1-671","iso":"GU"},
  {"country":"Guatemala","code":"502","iso":"GT"},
  {"country":"Guernsey","code":"44-1481","iso":"GG"},
  {"country":"Guinea","code":"224","iso":"GN"},
  {"country":"Guinea-Bissau","code":"245","iso":"GW"},
  {"country":"Guyana","code":"592","iso":"GY"},
  {"country":"Haiti","code":"509","iso":"HT"},
  {"country":"Honduras","code":"504","iso":"HN"},
  {"country":"Hong Kong","code":"852","iso":"HK"},
  {"country":"Hungary","code":"36","iso":"HU"},
  {"country":"Iceland","code":"354","iso":"IS"},
  {"country":"India","code":"91","iso":"IN"},
  {"country":"Indonesia","code":"62","iso":"ID"},
  {"country":"Iran","code":"98","iso":"IR"},
  {"country":"Iraq","code":"964","iso":"IQ"},
  {"country":"Ireland","code":"353","iso":"IE"},
  {"country":"Isle of Man","code":"44-1624","iso":"IM"},
  {"country":"Israel","code":"972","iso":"IL"},
  {"country":"Italy","code":"39","iso":"IT"},
  {"country":"Ivory Coast","code":"225","iso":"CI"},
  {"country":"Jamaica","code":"1-876","iso":"JM"},
  {"country":"Japan","code":"81","iso":"JP"},
  {"country":"Jersey","code":"44-1534","iso":"JE"},
  {"country":"Jordan","code":"962","iso":"JO"},
  {"country":"Kazakhstan","code":"7","iso":"KZ"},
  {"country":"Kenya","code":"254","iso":"KE"},
  {"country":"Kiribati","code":"686","iso":"KI"},
  {"country":"Kosovo","code":"383","iso":"XK"},
  {"country":"Kuwait","code":"965","iso":"KW"},
  {"country":"Kyrgyzstan","code":"996","iso":"KG"},
  {"country":"Laos","code":"856","iso":"LA"},
  {"country":"Latvia","code":"371","iso":"LV"},
  {"country":"Lebanon","code":"961","iso":"LB"},
  {"country":"Lesotho","code":"266","iso":"LS"},
  {"country":"Liberia","code":"231","iso":"LR"},
  {"country":"Libya","code":"218","iso":"LY"},
  {"country":"Liechtenstein","code":"423","iso":"LI"},
  {"country":"Lithuania","code":"370","iso":"LT"},
  {"country":"Luxembourg","code":"352","iso":"LU"},
  {"country":"Macao","code":"853","iso":"MO"},
  {"country":"Macedonia","code":"389","iso":"MK"},
  {"country":"Madagascar","code":"261","iso":"MG"},
  {"country":"Malawi","code":"265","iso":"MW"},
  {"country":"Malaysia","code":"60","iso":"MY"},
  {"country":"Maldives","code":"960","iso":"MV"},
  {"country":"Mali","code":"223","iso":"ML"},
  {"country":"Malta","code":"356","iso":"MT"},
  {"country":"Marshall Islands","code":"692","iso":"MH"},
  {"country":"Mauritania","code":"222","iso":"MR"},
  {"country":"Mauritius","code":"230","iso":"MU"},
  {"country":"Mayotte","code":"262","iso":"YT"},
  {"country":"Mexico","code":"52","iso":"MX"},
  {"country":"Micronesia","code":"691","iso":"FM"},
  {"country":"Moldova","code":"373","iso":"MD"},
  {"country":"Monaco","code":"377","iso":"MC"},
  {"country":"Mongolia","code":"976","iso":"MN"},
  {"country":"Montenegro","code":"382","iso":"ME"},
  {"country":"Montserrat","code":"1-664","iso":"MS"},
  {"country":"Morocco","code":"212","iso":"MA"},
  {"country":"Mozambique","code":"258","iso":"MZ"},
  {"country":"Myanmar","code":"95","iso":"MM"},
  {"country":"Namibia","code":"264","iso":"NA"},
  {"country":"Nauru","code":"674","iso":"NR"},
  {"country":"Nepal","code":"977","iso":"NP"},
  {"country":"Netherlands","code":"31","iso":"NL"},
  {"country":"Netherlands Antilles","code":"599","iso":"AN"},
  {"country":"New Caledonia","code":"687","iso":"NC"},
  {"country":"New Zealand","code":"64","iso":"NZ"},
  {"country":"Nicaragua","code":"505","iso":"NI"},
  {"country":"Niger","code":"227","iso":"NE"},
  {"country":"Nigeria","code":"234","iso":"NG"},
  {"country":"Niue","code":"683","iso":"NU"},
  {"country":"North Korea","code":"850","iso":"KP"},
  {"country":"Northern Mariana Islands","code":"1-670","iso":"MP"},
  {"country":"Norway","code":"47","iso":"NO"},
  {"country":"Oman","code":"968","iso":"OM"},
  {"country":"Pakistan","code":"92","iso":"PK"},
  {"country":"Palau","code":"680","iso":"PW"},
  {"country":"Palestine","code":"970","iso":"PS"},
  {"country":"Panama","code":"507","iso":"PA"},
  {"country":"Papua New Guinea","code":"675","iso":"PG"},
  {"country":"Paraguay","code":"595","iso":"PY"},
  {"country":"Peru","code":"51","iso":"PE"},
  {"country":"Philippines","code":"63","iso":"PH"},
  {"country":"Pitcairn","code":"64","iso":"PN"},
  {"country":"Poland","code":"48","iso":"PL"},
  {"country":"Portugal","code":"351","iso":"PT"},
  {"country":"Puerto Rico","code":"1-787, 1-939","iso":"PR"},
  {"country":"Qatar","code":"974","iso":"QA"},
  {"country":"Republic of the Congo","code":"242","iso":"CG"},
  {"country":"Reunion","code":"262","iso":"RE"},
  {"country":"Romania","code":"40","iso":"RO"},
  {"country":"Russia","code":"7","iso":"RU"},
  {"country":"Rwanda","code":"250","iso":"RW"},
  {"country":"Saint Barthelemy","code":"590","iso":"BL"},
  {"country":"Saint Helena","code":"290","iso":"SH"},
  {"country":"Saint Kitts and Nevis","code":"1-869","iso":"KN"},
  {"country":"Saint Lucia","code":"1-758","iso":"LC"},
  {"country":"Saint Martin","code":"590","iso":"MF"},
  {"country":"Saint Pierre and Miquelon","code":"508","iso":"PM"},
  {"country":"Saint Vincent and the Grenadines","code":"1-784","iso":"VC"},
  {"country":"Samoa","code":"685","iso":"WS"},
  {"country":"San Marino","code":"378","iso":"SM"},
  {"country":"Sao Tome and Principe","code":"239","iso":"ST"},
  {"country":"Saudi Arabia","code":"966","iso":"SA"},
  {"country":"Senegal","code":"221","iso":"SN"},
  {"country":"Serbia","code":"381","iso":"RS"},
  {"country":"Seychelles","code":"248","iso":"SC"},
  {"country":"Sierra Leone","code":"232","iso":"SL"},
  {"country":"Singapore","code":"65","iso":"SG"},
  {"country":"Sint Maarten","code":"1-721","iso":"SX"},
  {"country":"Slovakia","code":"421","iso":"SK"},
  {"country":"Slovenia","code":"386","iso":"SI"},
  {"country":"Solomon Islands","code":"677","iso":"SB"},
  {"country":"Somalia","code":"252","iso":"SO"},
  {"country":"South Africa","code":"27","iso":"ZA"},
  {"country":"South Korea","code":"82","iso":"KR"},
  {"country":"South Sudan","code":"211","iso":"SS"},
  {"country":"Spain","code":"34","iso":"ES"},
  {"country":"Sri Lanka","code":"94","iso":"LK"},
  {"country":"Sudan","code":"249","iso":"SD"},
  {"country":"Suriname","code":"597","iso":"SR"},
  {"country":"Svalbard and Jan Mayen","code":"47","iso":"SJ"},
  {"country":"Swaziland","code":"268","iso":"SZ"},
  {"country":"Sweden","code":"46","iso":"SE"},
  {"country":"Switzerland","code":"41","iso":"CH"},
  {"country":"Syria","code":"963","iso":"SY"},
  {"country":"Taiwan","code":"886","iso":"TW"},
  {"country":"Tajikistan","code":"992","iso":"TJ"},
  {"country":"Tanzania","code":"255","iso":"TZ"},
  {"country":"Thailand","code":"66","iso":"TH"},
  {"country":"Togo","code":"228","iso":"TG"},
  {"country":"Tokelau","code":"690","iso":"TK"},
  {"country":"Tonga","code":"676","iso":"TO"},
  {"country":"Trinidad and Tobago","code":"1-868","iso":"TT"},
  {"country":"Tunisia","code":"216","iso":"TN"},
  {"country":"Turkey","code":"90","iso":"TR"},
  {"country":"Turkmenistan","code":"993","iso":"TM"},
  {"country":"Turks and Caicos Islands","code":"1-649","iso":"TC"},
  {"country":"Tuvalu","code":"688","iso":"TV"},
  {"country":"U.S. Virgin Islands","code":"1-340","iso":"VI"},
  {"country":"Uganda","code":"256","iso":"UG"},
  {"country":"Ukraine","code":"380","iso":"UA"},
  {"country":"United Arab Emirates","code":"971","iso":"AE"},
  {"country":"United Kingdom","code":"44","iso":"GB"},
  {"country":"United States","code":"1","iso":"US"},
  {"country":"Uruguay","code":"598","iso":"UY"},
  {"country":"Uzbekistan","code":"998","iso":"UZ"},
  {"country":"Vanuatu","code":"678","iso":"VU"},
  {"country":"Vatican","code":"379","iso":"VA"},
  {"country":"Venezuela","code":"58","iso":"VE"},
  {"country":"Vietnam","code":"84","iso":"VN"},
  {"country":"Wallis and Futuna","code":"681","iso":"WF"},
  {"country":"Western Sahara","code":"212","iso":"EH"},
  {"country":"Yemen","code":"967","iso":"YE"},
  {"country":"Zambia","code":"260","iso":"ZM"},
  {"country":"Zimbabwe","code":"263","iso":"ZW"}];

  ngOnInit() {
    this.initForm();
    this.getlanguages();
    this.Countries.sort((a, b) => (a.country < b.country) ? -1 : 1);
    this.windowRef = this.windowRefer()
    console.log(this.windowRef);

    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
      size: "invisible",
      callback: function (response) {
        // reCAPTCHA solved - will proceed with submit function
        console.log(response);
      },
      "expired-callback": function () {
        // Reset reCAPTCHA?
      }
    })
    this.windowRef.recaptchaVerifier.render();
  }

  windowRefer() {
    return window
  }
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricbuzzer"  || this.siteName == 'cricbuzzerlive') {
      if (this.range == "sp") {
        // this.siteName = "cricbuzzer"

        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "pg") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('portuguese');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('turkish');
      }
      else if (this.range == "tu") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add('turkish');
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');

      }
      else {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.add(this.siteName);
        bodytag.classList.remove('spanish');
        bodytag.classList.remove('portuguese');
        bodytag.classList.remove('turkish');
      }
    }
    this.tokenService.setLanguage(this.range);
  }
  getLanguage() {
    let L = []
    this.clientApi.getlanguage().subscribe((resp: any) => {
      this.language = resp
      this.language.forEach(data => {
        if (data.lang == this.range) {
          L.push(data)
        }
        this.Alllanguage = L
        
        this.shareService.sharelanguage(this.Alllanguage[0]);
      })
    })
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  initForm() {
    this.SignUpForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordStrengthValidator,
      ])],
      confirmPassword: ['', Validators.required],
      dob: ['', Validators.required],
      dom: ['', Validators.required],
      doy: ['', Validators.required],
      terms:['',Validators.requiredTrue]

    }, { validators: passwordMatchingValidatior });

    this.PhoneForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      otp: ['', Validators.required],
      b2cID: [''],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordStrengthValidator,
      ])],
      confirmPassword: ['', Validators.required],
      dob: ['', Validators.required],
      dom: ['', Validators.required],
      doy: ['', Validators.required],
      terms:['',Validators.requiredTrue]
    }, { validators: passwordMatchingValidatior });

    if (!this.isCaptcha) {
      this.SignUpForm.addControl('origin', new FormControl(this.getDomainName(location.origin)));
    }

  }

  loginWithGoogle() {
    this.authService.GoogleAuth(0);
  }

  loginWithFacebook() {
    this.authService.FacebookAuth(0);
  }

  loginWithPhone() {
    console.log(this.PhoneForm.value);
    this.phoneSubmitted = true;
    if (this.isPendingPhone) {
      return;
    }
    if (!this.PhoneForm.valid) {
      console.log('invalid')
      return;
    }
    this.isPendingPhone = true;
    $('#login_loading').css('display', 'flex');
    var dob = this.pf.dob.value + "-" + this.pf.dom.value + "-" + this.pf.doy.value;
      this.authService.otpSubmit(this.pf.otp.value,0,this.pf.password.value,dob,this.pf['b2cID'].value).then(() => {
        this.phoneSubmitted = false;
        this.isPendingPhone = false;
        this.PhoneForm.reset();
        this.hideOverlayInfo('#Phone-popup');
      }
    );
  }

  getOtp() {
    if (this.pf.phoneNumber == null) {
      this.phoneError = "Phone Number is Required";
    }
    else {
      $('#login_loading').css('display', 'flex');
      this.phoneError = "";
      const appVerifier = this.windowRef.recaptchaVerifier;
      console.log(this.selectedCountry.split('+')[1] + this.pf.phoneNumber.value)
      this.authService.phoneLogin(this.selectedCountry + this.pf.phoneNumber.value, appVerifier);
    }
  }

  get pf() {
    return this.PhoneForm.controls;
  }

  private loginViaTelegram(loginData: any) {
    this.ngZone.run(() => {
      if (loginData) {
       this.telegramData = loginData;
       this.from ='1';
       this.submitTelegram()
      //  this.showOverlayInfo('#Email-popup');
      }      
    });
  }

  submitTelegram(){
    // if(this.EmailForm.invalid){
    //   this.toastr.error('Invalid Email');
    // }
    // else{
    //   }
    if(this.emailInTransit){
      return;
    }
    this.emailInTransit = true;
    $('#login_loading').css('display', 'flex');
  let userData = {
    firstName: this.telegramData.first_name != null ? this.telegramData.first_name : "",
    lastName: this.telegramData.last_name != null ? this.telegramData.last_name : "",
    userName: this.telegramData.id,
    password: "",
    currencyCode: environment.currency,
    email: "",
    phoneNumber: "",
    address: "",
    birthDate: "",
    firebaseId: this.telegramData.id,
    blocChain: "",
    domain: environment.origin,
    isb2c:1
  }
  this.loginService.register(userData).subscribe((resp: any) => {
    console.log(resp);
    if (resp.errorCode === 0) {
      this.toastr.success('Registered Successfully');
     
      this.tokenService.setToken(resp.result[0].token);
      this.tokenService.setUserInfo(resp.result[0]);
      window.location.href = window.location.origin + window.location.pathname;
    } else {
      this.toastr.error(resp.errorDescription);
    }
  }, err => {
    console.log(err);
  })
  }

  sendAffData(affData:any){
    this.loginService.addAffUser(affData).subscribe((resp: any)=>{
      if (resp.status !='Success') {
        this.sendAffData(affData);
      }
    })
  }
  
  async loginWithMetamask() {
    this.isPendingMetaMask = true;
    $('#login_loading').css('display', 'flex');

    let ethereum: any;
    let provider = await detectEthereumProvider();
    if (!provider) {
      this.isPendingMetaMask = false;
      this.toastr.error('Please install Metamask');
      $('#login_loading').css('display', 'none');
      return;
    }
    ethereum = provider;
    try {
      $('#login_loading').css('display', 'none');
      await ethereum.request({ method: 'eth_requestAccounts' });
      let data = {
        wallet: ethereum.selectedAddress
      }
      this.loginService.getNonce(data).subscribe(async (resp: any) => {
        this.isPendingMetaMask = false;
        if (resp.status === 'Success') {
          let result = await ethereum.request({
            method: 'personal_sign',
            params: [
              `0x${this.toHex(`${environment.domain}: ${resp.data.nonce}`)}`,
              resp.data.walletAdd,
            ],
          }).catch((error: any) => {
            this.toastr.error("Cancelled");
          });
          if (result) {
            this.metaData = resp.data;
            this.from ='0';
            this.metaSubmit()
            // this.showOverlayInfo('#Email-popup');
          }
        } else {
          this.toastr.error(resp.message);
        }
      }, err => {
        this.isPendingMetaMask = false;
        console.log(err);
      }
      );
    }
    catch (err) {
      console.log(err);
      this.isPendingMetaMask = false;
    }
  }

  metaSubmit(){
    // if(this.EmailForm.invalid){
    //   this.toastr.error('Invalid Email');
    // }
    // else{
     
    // }
    if(this.emailInTransit){
      return;
    }
    this.emailInTransit = true
    $('#login_loading').css('display', 'flex');
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      if (token != null || token != '') {
        let userData = {
          firstName: "",
          lastName: "",
          userName: "",
          password: "",
          currencyCode: environment.currency,
          email: "",
          phoneNumber: "",
          address: "",
          birthDate: "",
          firebaseId: this.metaData.nonce,
          blocChain: this.metaData.walletAdd,
          domain: environment.origin,
          isb2c:1
        }          
        this.loginService
          .register(userData)
          .subscribe((resp: any) => {
            if (resp.errorCode === 0) {
              this.toastr.success("Registered Successfully");
            
              this.tokenService.setToken(resp.result[0].token);
              this.tokenService.setUserInfo(resp.result[0]);
              window.location.href = window.location.origin + window.location.pathname;
            } else {
              this.toastr.error(resp.errorDescription);
            }
            $('#login_loading').css('display', 'none');
            this.emailInTransit = false;
          }, err => {
            $('#login_loading').css('display', 'none');
            this.emailInTransit = false;
          }
          );
      }
    });
    
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  get sf() {
    return this.SignUpForm.controls;
  }

  getDomainName(hostName) {
    let formatedHost = "";
    let splithostName = hostName.split('.');
    if (splithostName.length > 2) {
      formatedHost = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    } else {
      formatedHost = hostName.split('//')[1]
    }
    return formatedHost;
  }
  getb2cID() {
    this.clientApi.getb2cid().subscribe(
      (res: any) => {
        
        
        if (res) {
          this.b2cID = res.result[0].b2cID;
          console.log(this.b2cID,'getb2cid');
          this.PhoneForm.get('b2cID').setValue(parseInt(this.b2cID));
        }
      }
    );
  }
  selectCountry(code: string) {
    this.selectedCountry = '+' + code;
  }
  getImg() {
    // this.loginService
    //   .getImg()
    //   .subscribe((response: { img: string; log: string }) => {
    //     document
    //       .getElementById('authenticateImage')
    //       .setAttribute('src', this.getSecureImage(response.img));
    //     this.LoginForm.get('log').setValue(response.log);
    //   });
  }

  checkValue(isChecked:any){
    this.isChecked = isChecked;
    console.log(this.isChecked);
  }

  getSecureImage(img) {
    return `data:image/jpeg;base64, ${img}`;
  }

  SignUP() {
    this.registerSubmitted = true;
    if (this.isPendingRegister) {
      return;
    }
    if (this.SignUpForm.valid) {
      $('#login_loading').css('display', 'flex');
      this.isPendingRegister = true;
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        if (token != null || token != '') {
          let userData = {
            firstName: "",
            lastName: "",
            userName: "",
            password: this.SignUpForm.controls['password'].value,
            currencyCode: environment.currency,
            email: this.SignUpForm.controls['email'].value,
            phoneNumber: "",
            address: "",
            birthDate: this.SignUpForm.controls['dob'].value + "-" + this.SignUpForm.controls['dom'].value + "-" + this.SignUpForm.controls['doy'].value,
            firebaseId: "",
            blocChain: "",
            domain: environment.origin,
            isb2c:1
          }
          this.authService.SignUp(userData).then(()=>{
            this.registerSubmitted = false;
            this.isPendingRegister = false;
          })
        }
      });
    }
    else {
      console.log(this.SignUpForm.value);
      
      this.toastr.error('Invalid Details');
    }
  }

  showPassword() {
    this.visiblePassword = !this.visiblePassword;
  }

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  hideOverlayInfo(value) {
    $(value).fadeOut();
  }

}

export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};

export const PasswordStrengthValidator = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';
  let msg = '';
  if (!value) {
    return null;
  }

  let upperCaseCharacters = /[A-Z]+/g;

  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must contain at least one uppercase letter.',
    };
  }
};







