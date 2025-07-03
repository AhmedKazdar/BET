import { Component, NgZone, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormGroup, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/socialshared/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import firebase from 'firebase/app';
import 'firebase/auth';
import detectEthereumProvider from '@metamask/detect-provider';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ClientApiService } from 'src/app/services/client-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  siteName = environment.siteName;
  isLcRouting = environment.isLcRouting;


  LoginForm: FormGroup;
  PhoneForm: FormGroup;
  //EmailForm:FormGroup;
  submitted: boolean = false;
  isCaptcha = environment.isCaptcha;
  isGoogle =environment.isGoogle;
  isFacebook  =environment.isFacebook;
  isTelegram  =environment.isTelegram;
  isEmail  =environment.isEmail;
  isMetamask  =environment.isMetamask;
  LoginWithPhone  =environment.LoginWithPhone;
  visiblePassword: boolean = false;
  phoneSubmitted: boolean = false;
  isPendingPhone: boolean = false;
  isPendingMetaMask: boolean = false;
  phoneError = "";
  emailError = "";
  emailInTransit: boolean = false;
  metaData: any;
  telegramData: any;
  from: string = '0';
  result: any;
  isPendingLogin: boolean = false;
  AferLoginChangePassword: boolean = environment.AferLoginChangePassword;
  windowRef: any;
  selectedCountry = "+91";
  highCom: any;
  Countries = [{ "country": "Afghanistan", "code": "93", "iso": "AF" },
  { "country": "Albania", "code": "355", "iso": "AL" },
  { "country": "Algeria", "code": "213", "iso": "DZ" },
  { "country": "American Samoa", "code": "1-684", "iso": "AS" },
  { "country": "Andorra", "code": "376", "iso": "AD" },
  { "country": "Angola", "code": "244", "iso": "AO" },
  { "country": "Anguilla", "code": "1-264", "iso": "AI" },
  { "country": "Antarctica", "code": "672", "iso": "AQ" },
  { "country": "Antigua and Barbuda", "code": "1-268", "iso": "AG" },
  { "country": "Argentina", "code": "54", "iso": "AR" },
  { "country": "Armenia", "code": "374", "iso": "AM" },
  { "country": "Aruba", "code": "297", "iso": "AW" },
  { "country": "Australia", "code": "61", "iso": "AU" },
  { "country": "Austria", "code": "43", "iso": "AT" },
  { "country": "Azerbaijan", "code": "994", "iso": "AZ" },
  { "country": "Bahamas", "code": "1-242", "iso": "BS" },
  { "country": "Bahrain", "code": "973", "iso": "BH" },
  { "country": "Bangladesh", "code": "880", "iso": "BD" },
  { "country": "Barbados", "code": "1-246", "iso": "BB" },
  { "country": "Belarus", "code": "375", "iso": "BY" },
  { "country": "Belgium", "code": "32", "iso": "BE" },
  { "country": "Belize", "code": "501", "iso": "BZ" },
  { "country": "Benin", "code": "229", "iso": "BJ" },
  { "country": "Bermuda", "code": "1-441", "iso": "BM" },
  { "country": "Bhutan", "code": "975", "iso": "BT" },
  { "country": "Bolivia", "code": "591", "iso": "BO" },
  { "country": "Bosnia and Herzegovina", "code": "387", "iso": "BA" },
  { "country": "Botswana", "code": "267", "iso": "BW" },
  { "country": "Brazil", "code": "55", "iso": "BR" },
  { "country": "British Indian Ocean Territory", "code": "246", "iso": "IO" },
  { "country": "British Virgin Islands", "code": "1-284", "iso": "VG" },
  { "country": "Brunei", "code": "673", "iso": "BN" },
  { "country": "Bulgaria", "code": "359", "iso": "BG" },
  { "country": "Burkina Faso", "code": "226", "iso": "BF" },
  { "country": "Burundi", "code": "257", "iso": "BI" },
  { "country": "Cambodia", "code": "855", "iso": "KH" },
  { "country": "Cameroon", "code": "237", "iso": "CM" },
  { "country": "Canada", "code": "1", "iso": "CA" },
  { "country": "Cape Verde", "code": "238", "iso": "CV" },
  { "country": "Cayman Islands", "code": "1-345", "iso": "KY" },
  { "country": "Central African Republic", "code": "236", "iso": "CF" },
  { "country": "Chad", "code": "235", "iso": "TD" },
  { "country": "Chile", "code": "56", "iso": "CL" },
  { "country": "China", "code": "86", "iso": "CN" },
  { "country": "Christmas Island", "code": "61", "iso": "CX" },
  { "country": "Cocos Islands", "code": "61", "iso": "CC" },
  { "country": "Colombia", "code": "57", "iso": "CO" },
  { "country": "Comoros", "code": "269", "iso": "KM" },
  { "country": "Cook Islands", "code": "682", "iso": "CK" },
  { "country": "Costa Rica", "code": "506", "iso": "CR" },
  { "country": "Croatia", "code": "385", "iso": "HR" },
  { "country": "Cuba", "code": "53", "iso": "CU" },
  { "country": "Curacao", "code": "599", "iso": "CW" },
  { "country": "Cyprus", "code": "357", "iso": "CY" },
  { "country": "Czech Republic", "code": "420", "iso": "CZ" },
  { "country": "Democratic Republic of the Congo", "code": "243", "iso": "CD" },
  { "country": "Denmark", "code": "45", "iso": "DK" },
  { "country": "Djibouti", "code": "253", "iso": "DJ" },
  { "country": "Dominica", "code": "1-767", "iso": "DM" },
  { "country": "Dominican Republic", "code": "1-809, 1-829, 1-849", "iso": "DO" },
  { "country": "East Timor", "code": "670", "iso": "TL" },
  { "country": "Ecuador", "code": "593", "iso": "EC" },
  { "country": "Egypt", "code": "20", "iso": "EG" },
  { "country": "El Salvador", "code": "503", "iso": "SV" },
  { "country": "Equatorial Guinea", "code": "240", "iso": "GQ" },
  { "country": "Eritrea", "code": "291", "iso": "ER" },
  { "country": "Estonia", "code": "372", "iso": "EE" },
  { "country": "Ethiopia", "code": "251", "iso": "ET" },
  { "country": "Falkland Islands", "code": "500", "iso": "FK" },
  { "country": "Faroe Islands", "code": "298", "iso": "FO" },
  { "country": "Fiji", "code": "679", "iso": "FJ" },
  { "country": "Finland", "code": "358", "iso": "FI" },
  { "country": "France", "code": "33", "iso": "FR" },
  { "country": "French Polynesia", "code": "689", "iso": "PF" },
  { "country": "Gabon", "code": "241", "iso": "GA" },
  { "country": "Gambia", "code": "220", "iso": "GM" },
  { "country": "Georgia", "code": "995", "iso": "GE" },
  { "country": "Germany", "code": "49", "iso": "DE" },
  { "country": "Ghana", "code": "233", "iso": "GH" },
  { "country": "Gibraltar", "code": "350", "iso": "GI" },
  { "country": "Greece", "code": "30", "iso": "GR" },
  { "country": "Greenland", "code": "299", "iso": "GL" },
  { "country": "Grenada", "code": "1-473", "iso": "GD" },
  { "country": "Guam", "code": "1-671", "iso": "GU" },
  { "country": "Guatemala", "code": "502", "iso": "GT" },
  { "country": "Guernsey", "code": "44-1481", "iso": "GG" },
  { "country": "Guinea", "code": "224", "iso": "GN" },
  { "country": "Guinea-Bissau", "code": "245", "iso": "GW" },
  { "country": "Guyana", "code": "592", "iso": "GY" },
  { "country": "Haiti", "code": "509", "iso": "HT" },
  { "country": "Honduras", "code": "504", "iso": "HN" },
  { "country": "Hong Kong", "code": "852", "iso": "HK" },
  { "country": "Hungary", "code": "36", "iso": "HU" },
  { "country": "Iceland", "code": "354", "iso": "IS" },
  { "country": "India", "code": "91", "iso": "IN" },
  { "country": "Indonesia", "code": "62", "iso": "ID" },
  { "country": "Iran", "code": "98", "iso": "IR" },
  { "country": "Iraq", "code": "964", "iso": "IQ" },
  { "country": "Ireland", "code": "353", "iso": "IE" },
  { "country": "Isle of Man", "code": "44-1624", "iso": "IM" },
  { "country": "Israel", "code": "972", "iso": "IL" },
  { "country": "Italy", "code": "39", "iso": "IT" },
  { "country": "Ivory Coast", "code": "225", "iso": "CI" },
  { "country": "Jamaica", "code": "1-876", "iso": "JM" },
  { "country": "Japan", "code": "81", "iso": "JP" },
  { "country": "Jersey", "code": "44-1534", "iso": "JE" },
  { "country": "Jordan", "code": "962", "iso": "JO" },
  { "country": "Kazakhstan", "code": "7", "iso": "KZ" },
  { "country": "Kenya", "code": "254", "iso": "KE" },
  { "country": "Kiribati", "code": "686", "iso": "KI" },
  { "country": "Kosovo", "code": "383", "iso": "XK" },
  { "country": "Kuwait", "code": "965", "iso": "KW" },
  { "country": "Kyrgyzstan", "code": "996", "iso": "KG" },
  { "country": "Laos", "code": "856", "iso": "LA" },
  { "country": "Latvia", "code": "371", "iso": "LV" },
  { "country": "Lebanon", "code": "961", "iso": "LB" },
  { "country": "Lesotho", "code": "266", "iso": "LS" },
  { "country": "Liberia", "code": "231", "iso": "LR" },
  { "country": "Libya", "code": "218", "iso": "LY" },
  { "country": "Liechtenstein", "code": "423", "iso": "LI" },
  { "country": "Lithuania", "code": "370", "iso": "LT" },
  { "country": "Luxembourg", "code": "352", "iso": "LU" },
  { "country": "Macao", "code": "853", "iso": "MO" },
  { "country": "Macedonia", "code": "389", "iso": "MK" },
  { "country": "Madagascar", "code": "261", "iso": "MG" },
  { "country": "Malawi", "code": "265", "iso": "MW" },
  { "country": "Malaysia", "code": "60", "iso": "MY" },
  { "country": "Maldives", "code": "960", "iso": "MV" },
  { "country": "Mali", "code": "223", "iso": "ML" },
  { "country": "Malta", "code": "356", "iso": "MT" },
  { "country": "Marshall Islands", "code": "692", "iso": "MH" },
  { "country": "Mauritania", "code": "222", "iso": "MR" },
  { "country": "Mauritius", "code": "230", "iso": "MU" },
  { "country": "Mayotte", "code": "262", "iso": "YT" },
  { "country": "Mexico", "code": "52", "iso": "MX" },
  { "country": "Micronesia", "code": "691", "iso": "FM" },
  { "country": "Moldova", "code": "373", "iso": "MD" },
  { "country": "Monaco", "code": "377", "iso": "MC" },
  { "country": "Mongolia", "code": "976", "iso": "MN" },
  { "country": "Montenegro", "code": "382", "iso": "ME" },
  { "country": "Montserrat", "code": "1-664", "iso": "MS" },
  { "country": "Morocco", "code": "212", "iso": "MA" },
  { "country": "Mozambique", "code": "258", "iso": "MZ" },
  { "country": "Myanmar", "code": "95", "iso": "MM" },
  { "country": "Namibia", "code": "264", "iso": "NA" },
  { "country": "Nauru", "code": "674", "iso": "NR" },
  { "country": "Nepal", "code": "977", "iso": "NP" },
  { "country": "Netherlands", "code": "31", "iso": "NL" },
  { "country": "Netherlands Antilles", "code": "599", "iso": "AN" },
  { "country": "New Caledonia", "code": "687", "iso": "NC" },
  { "country": "New Zealand", "code": "64", "iso": "NZ" },
  { "country": "Nicaragua", "code": "505", "iso": "NI" },
  { "country": "Niger", "code": "227", "iso": "NE" },
  { "country": "Nigeria", "code": "234", "iso": "NG" },
  { "country": "Niue", "code": "683", "iso": "NU" },
  { "country": "North Korea", "code": "850", "iso": "KP" },
  { "country": "Northern Mariana Islands", "code": "1-670", "iso": "MP" },
  { "country": "Norway", "code": "47", "iso": "NO" },
  { "country": "Oman", "code": "968", "iso": "OM" },
  { "country": "Pakistan", "code": "92", "iso": "PK" },
  { "country": "Palau", "code": "680", "iso": "PW" },
  { "country": "Palestine", "code": "970", "iso": "PS" },
  { "country": "Panama", "code": "507", "iso": "PA" },
  { "country": "Papua New Guinea", "code": "675", "iso": "PG" },
  { "country": "Paraguay", "code": "595", "iso": "PY" },
  { "country": "Peru", "code": "51", "iso": "PE" },
  { "country": "Philippines", "code": "63", "iso": "PH" },
  { "country": "Pitcairn", "code": "64", "iso": "PN" },
  { "country": "Poland", "code": "48", "iso": "PL" },
  { "country": "Portugal", "code": "351", "iso": "PT" },
  { "country": "Puerto Rico", "code": "1-787, 1-939", "iso": "PR" },
  { "country": "Qatar", "code": "974", "iso": "QA" },
  { "country": "Republic of the Congo", "code": "242", "iso": "CG" },
  { "country": "Reunion", "code": "262", "iso": "RE" },
  { "country": "Romania", "code": "40", "iso": "RO" },
  { "country": "Russia", "code": "7", "iso": "RU" },
  { "country": "Rwanda", "code": "250", "iso": "RW" },
  { "country": "Saint Barthelemy", "code": "590", "iso": "BL" },
  { "country": "Saint Helena", "code": "290", "iso": "SH" },
  { "country": "Saint Kitts and Nevis", "code": "1-869", "iso": "KN" },
  { "country": "Saint Lucia", "code": "1-758", "iso": "LC" },
  { "country": "Saint Martin", "code": "590", "iso": "MF" },
  { "country": "Saint Pierre and Miquelon", "code": "508", "iso": "PM" },
  { "country": "Saint Vincent and the Grenadines", "code": "1-784", "iso": "VC" },
  { "country": "Samoa", "code": "685", "iso": "WS" },
  { "country": "San Marino", "code": "378", "iso": "SM" },
  { "country": "Sao Tome and Principe", "code": "239", "iso": "ST" },
  { "country": "Saudi Arabia", "code": "966", "iso": "SA" },
  { "country": "Senegal", "code": "221", "iso": "SN" },
  { "country": "Serbia", "code": "381", "iso": "RS" },
  { "country": "Seychelles", "code": "248", "iso": "SC" },
  { "country": "Sierra Leone", "code": "232", "iso": "SL" },
  { "country": "Singapore", "code": "65", "iso": "SG" },
  { "country": "Sint Maarten", "code": "1-721", "iso": "SX" },
  { "country": "Slovakia", "code": "421", "iso": "SK" },
  { "country": "Slovenia", "code": "386", "iso": "SI" },
  { "country": "Solomon Islands", "code": "677", "iso": "SB" },
  { "country": "Somalia", "code": "252", "iso": "SO" },
  { "country": "South Africa", "code": "27", "iso": "ZA" },
  { "country": "South Korea", "code": "82", "iso": "KR" },
  { "country": "South Sudan", "code": "211", "iso": "SS" },
  { "country": "Spain", "code": "34", "iso": "ES" },
  { "country": "Sri Lanka", "code": "94", "iso": "LK" },
  { "country": "Sudan", "code": "249", "iso": "SD" },
  { "country": "Suriname", "code": "597", "iso": "SR" },
  { "country": "Svalbard and Jan Mayen", "code": "47", "iso": "SJ" },
  { "country": "Swaziland", "code": "268", "iso": "SZ" },
  { "country": "Sweden", "code": "46", "iso": "SE" },
  { "country": "Switzerland", "code": "41", "iso": "CH" },
  { "country": "Syria", "code": "963", "iso": "SY" },
  { "country": "Taiwan", "code": "886", "iso": "TW" },
  { "country": "Tajikistan", "code": "992", "iso": "TJ" },
  { "country": "Tanzania", "code": "255", "iso": "TZ" },
  { "country": "Thailand", "code": "66", "iso": "TH" },
  { "country": "Togo", "code": "228", "iso": "TG" },
  { "country": "Tokelau", "code": "690", "iso": "TK" },
  { "country": "Tonga", "code": "676", "iso": "TO" },
  { "country": "Trinidad and Tobago", "code": "1-868", "iso": "TT" },
  { "country": "Tunisia", "code": "216", "iso": "TN" },
  { "country": "Turkey", "code": "90", "iso": "TR" },
  { "country": "Turkmenistan", "code": "993", "iso": "TM" },
  { "country": "Turks and Caicos Islands", "code": "1-649", "iso": "TC" },
  { "country": "Tuvalu", "code": "688", "iso": "TV" },
  { "country": "U.S. Virgin Islands", "code": "1-340", "iso": "VI" },
  { "country": "Uganda", "code": "256", "iso": "UG" },
  { "country": "Ukraine", "code": "380", "iso": "UA" },
  { "country": "United Arab Emirates", "code": "971", "iso": "AE" },
  { "country": "United Kingdom", "code": "44", "iso": "GB" },
  { "country": "United States", "code": "1", "iso": "US" },
  { "country": "Uruguay", "code": "598", "iso": "UY" },
  { "country": "Uzbekistan", "code": "998", "iso": "UZ" },
  { "country": "Vanuatu", "code": "678", "iso": "VU" },
  { "country": "Vatican", "code": "379", "iso": "VA" },
  { "country": "Venezuela", "code": "58", "iso": "VE" },
  { "country": "Vietnam", "code": "84", "iso": "VN" },
  { "country": "Wallis and Futuna", "code": "681", "iso": "WF" },
  { "country": "Western Sahara", "code": "212", "iso": "EH" },
  { "country": "Yemen", "code": "967", "iso": "YE" },
  { "country": "Zambia", "code": "260", "iso": "ZM" },
  { "country": "Zimbabwe", "code": "263", "iso": "ZW" }];
  language: any;
  range = "en";
  Alllanguage: any;
  Update: any;
  currentlanguage: string;
  isb2c: boolean = environment.isb2c;

  // Test user interface
  private testUsers: Array<{
    username: string;
    password: string;
    name: string;
    email?: string;
    id?: string | number;
  }> = [
    { 
      id: 1001,
      username: 'testuser', 
      password: 'testpass123', 
      name: 'Test User',
      email: 'testuser@example.com'
    },
    { 
      id: 1002,
      username: 'demo', 
      password: 'demo123', 
      name: 'Demo User',
      email: 'demo@example.com'
    }
  ];

  selectedlang: any;

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router,
    private main: MainService,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private toastr: ToastrService,
    private shareService: ShareDataService,
    private clientApi: ClientApiService,
    private ngZone: NgZone

  ) {
    if (this.tokenService.getLanguage()) {
      this.selectedlang = this.tokenService.getLanguage()
      this.selectlanguage(this.selectedlang)
    } else {
      this.selectlanguage('en')
    }
    this.highCom = '/highlight';
    window['loginViaTelegram'] = (loginData: any) => this.loginViaTelegram(loginData);
  }

  ngOnInit() {
    this.getlanguages();
    this.initLoginForm();
    this.Countries.sort((a, b) => (a.country < b.country) ? -1 : 1);
    this.windowRef = this.windowRefer()
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
    
    // Apply theme class on initialization
    this.applyTheme();
  }
  
  private applyTheme() {
    const bodyTag = document.getElementsByTagName("BODY")[0];
    // Remove any existing theme classes
    bodyTag.classList.remove('spanish', 'portuguese', 'turkish', 'cricbuzzer', 'cricbuzzerlive');
    
    // Add the current site's theme class
    if (this.siteName === 'cricbuzzer' || this.siteName === 'cricbuzzerlive') {
      bodyTag.classList.add(this.siteName);
    }
  }
  selectlanguage(newValue) {
    this.getLanguage();
    this.range = newValue;
    if (this.siteName == "cricbuzzer" || this.siteName == 'cricbuzzerlive') {
      if (this.range == "sp") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.remove('portuguese', 'turkish', 'cricbuzzer', 'cricbuzzerlive');
        bodytag.classList.add('spanish');
      }
      else if (this.range == "pg") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.remove('spanish', 'turkish', 'cricbuzzer', 'cricbuzzerlive');
        bodytag.classList.add('portuguese');
      }
      else if (this.range == "tu") {
        let bodytag = document.getElementsByTagName("BODY")[0];
        bodytag.classList.remove('spanish', 'portuguese', 'cricbuzzer', 'cricbuzzerlive');
        bodytag.classList.add('turkish');
      }
      else {
        this.applyTheme(); // Re-apply the theme when default language is selected
      }
    }
    this.tokenService.setLanguage(this.range);
  }
  async getLanguage() {
    try {
      let L = [];
      const resp = await this.clientApi.getlanguage();
      this.language = resp;
      this.language.forEach(data => {
        if (data.lang == this.range) {
          L.push(data);
        }
        this.Alllanguage = L;
        if (this.Alllanguage.length > 0) {
          this.shareService.sharelanguage(this.Alllanguage[0]);
        }
      });
    } catch (error) {
      console.error('Error fetching language:', error);
      // Handle error appropriately
    }
  }

  windowRefer() {
    return window
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data
        }
      // console.log(this.Update);

    })
  }
  initLoginForm() {
    this.LoginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      captcha: [this.isCaptcha ? '' : '0000', Validators.required],
      log: [this.isCaptcha ? '' : '0000', Validators.required]
    });

    this.PhoneForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      otp: ['', Validators.required],
      // email: ['', [Validators.email, Validators.required]],
    });

    // this.EmailForm = this.fb.group({
    //   email: ['', [Validators.email, Validators.required]],
    // });

    if (!this.isCaptcha) {
      this.LoginForm.addControl('origin', new FormControl(this.getDomainName(location.origin)));
    }

  }

  get f() {
    return this.LoginForm.controls;
  }
  selectCountry(code: string) {
    this.selectedCountry = '+' + code;
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

  getImg() {
    this.loginService
      .getImg()
      .subscribe((response: { img: string; log: string }) => {
        document
          .getElementById('authenticateImage')
          .setAttribute('src', this.getSecureImage(response.img));
        this.LoginForm.get('log').setValue(response.log);
      });
  }

  getSecureImage(img) {
    return `data:image/jpeg;base64, ${img}`;
  }

  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  hideOverlayInfo(value) {
    $(value).fadeOut();
  }


  loginWithGoogle() {
    this.authService.GoogleAuth(1);
  }

  loginWithFacebook() {
    this.authService.FacebookAuth(1);
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
    this.authService.otpSubmit(this.pf.otp.value, 1, "", "","").then(() => {
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
      console.log(loginData);
      if (loginData) {
        this.telegramData = loginData;
        this.from = '1';
        this.submitTelegram();
        // this.showOverlayInfo('#Email-popup');
      }
    });
  }

  submitTelegram() {
    if (this.emailInTransit) {
      return;
    }
    this.emailInTransit = true;
    $('#login_loading').css('display', 'flex');
    let body = {
      userName: "",
      password: "",
      firebaseId: this.telegramData.id,
      captcha: '0000',
      log: '0000',
      origin: environment.origin
    }
    this.loginService.login(body)
      .subscribe((resp: any) => {
        if (resp.errorCode === 0) {
          this.toastr.success("Login Successfully");
          this.tokenService.setToken(resp.result[0].token);
          this.tokenService.setUserInfo(resp.result[0]);
          localStorage.setItem("loginpass", this.LoginForm.value.password)
          window.location.href = window.location.origin + window.location.pathname;
          $('#login_loading').css('display', 'none');
        } else {
          if (resp.errorDescription === "User Not Found.") {
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
              isb2c: 1
            }
            this.loginService.register(userData)
              .subscribe((resp: any) => {
                if (resp.errorCode === 0) {
                  this.toastr.success("Registered Successfully");
                 
                  this.tokenService.setToken(resp.result[0].token);
                  this.tokenService.setUserInfo(resp.result[0]);
                  window.location.href = window.location.origin + window.location.pathname;
                } else {
                  this.toastr.error(resp.errorDescription);
                  this.authService.SignOut();
                }
                $('#login_loading').css('display', 'none');
                this.isPendingMetaMask = false;
              }, err => {
                $('#login_loading').css('display', 'none');
                this.isPendingMetaMask = false;
              }
              );
          }
          else {
            this.toastr.error(resp.errorDescription);
            this.authService.SignOut();
          }
        }
      }, err => {
        console.log(err);
        this.authService.SignOut();
      }
      );
    //   if(this.EmailForm.invalid){
    //     this.toastr.error('Invalid Email');
    //   }
    //   else{

    //  }
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
            $('#login_loading').css('display', 'flex');
            this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
              if (token != null || token != '') {
                let body = {
                  userName: resp.data.walletAdd,
                  password: "",
                  firebaseId: resp.data.nonce,
                  captcha: '0000',
                  log: '0000',
                  origin: environment.origin
                }
                this.loginService.login(body)
                  .subscribe((result: any) => {
                    if (result.errorCode === 0) {
                      this.toastr.success("Login Successfully");
                      this.tokenService.setToken(result.result[0].token);
                      this.tokenService.setUserInfo(result.result[0]);
                      window.location.href = window.location.origin + window.location.pathname;
                      $('#login_loading').css('display', 'none');
                    } else {
                      if (result.errorDescription === "User Not Found.") {
                        this.metaData = resp.data;
                        this.from = '0';
                        this.metaSubmit()
                        // this.showOverlayInfo('#Email-popup');
                      }
                      else {
                        this.toastr.error(resp.errorDescription);
                        this.authService.SignOut();
                      }
                    }
                  }, err => {
                    console.log(err);
                    this.authService.SignOut();
                  }
                  );
              }
            });
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


  metaSubmit() {
    // if(this.EmailForm.invalid){
    //   this.toastr.error('Invalid Email');
    // }
    // else{
    // }
    if (this.emailInTransit) {
      return;
    }
    this.emailInTransit = true;
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
      isb2c: 1
    }
    this.loginService.register(userData)
      .subscribe((resp: any) => {
        if (resp.errorCode === 0) {
          this.toastr.success("Registered Successfully");
        
          this.tokenService.setToken(resp.result[0].token);
          this.tokenService.setUserInfo(resp.result[0]);
          window.location.href = window.location.origin + window.location.pathname;
        } else {
          this.toastr.error(resp.errorDescription);
          this.authService.SignOut();
        }
        $('#login_loading').css('display', 'none');
        this.emailInTransit = false;
      }, err => {
        $('#login_loading').css('display', 'none');
        this.emailInTransit = false;
      }
      );

  }

  /**
   * Processes the login response from the API or mock
   */
  private processLoginResponse(response: any, password: string): void {
    if (response.errorCode === 0) {
      const userData = response.result[0];
      this.tokenService.setToken(userData.token);
      this.tokenService.setUserInfo(userData);
      
      // Store password if needed
      if (password) {
        localStorage.setItem("loginpass", password);
      }
      
      this.toastr.success(response.errorDescription || 'Login successful');
      this.LoginForm.reset();
      this.router.navigate(['/dash']);
    } else {
      this.toastr.error(response.errorDescription || 'Login failed');
    }
    
    this.isPendingLogin = false;
    $('#login_loading').css('display', 'none');
  }
  
  /**
   * Attempts to log in through the regular API
   */
  private attemptRegularLogin(userName: string, password: string): void {
    const data = {
      userName: userName,
      password: password,
      origin: environment.origin,
      firebaseId: "",
      captcha: "0000",
      log: "0000"
    };

    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    
    this.recaptchaV3Service.execute('importantAction').subscribe(
      (token: string) => {
        if (!token) {
          this.handleLoginError('Invalid reCAPTCHA token');
          return;
        }

        if (EMAIL_REGEXP.test(userName)) {
          // Handle email login (returns Promise)
          this.authService.SignInWithEmail(data, 0)
            .then(() => {
              // The actual response is handled in the auth service
              this.isPendingLogin = false;
              $('#login_loading').css('display', 'none');
            })
            .catch((error) => {
              this.handleLoginError('Login failed. Please try again.');
            });
        } else {
          // Handle regular username/password login (returns Observable)
          this.loginService.login(data).subscribe(
            (resp: any) => this.processLoginResponse(resp, password),
            (error) => this.handleLoginError('Login failed. Please try again.')
          );
        }
      },
      (error) => this.handleLoginError('Error verifying reCAPTCHA')
    );
  }
  
  /**
   * Handles login errors consistently
   */
  private handleLoginError(message: string): void {
    this.toastr.error(message);
    this.isPendingLogin = false;
    this.submitted = false;
    $('#login_loading').css('display', 'none');
  }
  
  /**
   * Converts a string to hex
   */
  private toHex(stringToConvert: string): string {
    return stringToConvert
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  Login() {
    this.submitted = true;
    if (this.LoginForm.invalid) {
      return;
    }

    const { userName, password } = this.LoginForm.value;
    this.isPendingLogin = true;
    $('#login_loading').css('display', 'flex');

    try {
      // Check against test users in local development
      if (!environment.production) {
        const testUser = this.testUsers.find(
          user => user.username.toLowerCase() === userName.toLowerCase() && 
                 user.password === password
        );

        if (testUser) {
          // Simulate successful login response matching the API format
          const mockResponse = {
            errorCode: 0,
            errorDescription: 'Login successful',
            result: [{
              token: `test_token_${Date.now()}`,
              id: testUser.id,
              username: testUser.username,
              name: testUser.name,
              email: testUser.email,
              // Add any other required user properties here
            }]
          };
          
          // Process the mock response like a real API response
          this.processLoginResponse(mockResponse, password);
          return;
        } else {
          // If test user not found, continue to regular login
          this.attemptRegularLogin(userName, password);
          return;
        }
      }
      
      // In production or when no test user matches
      this.attemptRegularLogin(userName, password);
    } catch (error) {
      console.error('Login error:', error);
      this.toastr.error('An error occurred during login');
      this.isPendingLogin = false;
      $('#login_loading').css('display', 'none');
    }
    if (this.isPendingLogin) {
      return;
    }
    this.isPendingLogin = true;
    let data = {
      userName: this.f.userName.value,
      password: this.f.password.value,
      origin: environment.origin,
      firebaseId: "",
      captcha: "0000",
      log: "0000"
    }
    $('#login_loading').css('display', 'flex');
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (EMAIL_REGEXP.test(this.f.userName.value)) {
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        if (token != null || token != "") {
          this.authService.SignInWithEmail(data, 0).then(() => {
            this.submitted = false;
            this.isPendingLogin = false;
          })
        }
      });
    }
    else {
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        if (token != null || token != "") {
          this.loginService
            .login(data)
            .subscribe((resp: any) => {
              if (resp.errorCode === 0) {
                this.tokenService.setToken(resp.result[0].token);
                this.tokenService.setUserInfo(resp.result[0]);
                localStorage.setItem("loginpass", password)
                console.log('Password stored in localStorage',password);
                this.result = resp.errorDescription;
                this.LoginForm.reset();
                window.location.href = window.location.origin + window.location.pathname;
              } else {
                if (!resp.errorDescription) {
                  resp.errorDescription = "Username or password is wrong"
                }
                this.result = resp.errorDescription;
              }
              $('#login_loading').css('display', 'none');
              this.submitted = false;
              this.isPendingLogin = false;
            }, err => {
              this.submitted = false;
              this.isPendingLogin = false;
            }
            );
        }
      });
    }
  }

  LoginWithDemo() {

    this.LoginForm = this.fb.group({
      userName: ['lcdemo', Validators.required],
      password: ['Asdf1234', Validators.required],
      captcha: ['0000', Validators.required],
      log: ['0000', Validators.required],
      origin: [this.getDomainName(location.origin)]
    });

    this.Login();
  }

  showPassword() {
    this.visiblePassword = !this.visiblePassword;
  }


}
