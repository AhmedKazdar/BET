// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


let siteName = "cric365";
let hostname = window.origin;
let origin = "";
let domain = "cricity.net";
let apisUrl = "https://cricity.net/all_apis.json";
let isCaptcha = false;
let isallSports = true;
let whatsapp = "+21623237006";
let whatsapp1 = "+21623237006";
let whatsapp2 = "+21623237006";
let AferLoginChangePassword = false
let isCasinoTab = true;
let isExchangeGames = true
let ishorseRace = true
let telegramBotName = ""
let currency="INR"
let auto = true
let isb2c = true
let isEtgcasino = true;
let whatsappChat ='';
let isTraslate = true
let whatsapp3 = '+21623237006';
let affiliteLink = ''
let isAffiliate = false;
let isRemoveBfMarket = true
let isTrnNo = true
let isSocial = true
let isBlueOcean= true

let LoginWithPhone = true
export const environment = {
  firebase: {
    apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
    authDomain: "cricity-fcda6.firebaseapp.com",
    projectId: "cricity-fcda6",
    storageBucket: "cricity-fcda6.firebasestorage.app",
    messagingSenderId: "131700140117",
    appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc"
  },
  recaptcha: {
    siteKey: '6LfXPpcjAAAAAHRJr1TKRVDyrQ7d5g-ZNdt-KgAB',
  },
  telegramBotName:"cricbuzzer_bot",
  production: false,
  apisUrl: apisUrl,
  siteName: siteName,
  whatsapp: whatsapp,
  whatsappChat: whatsappChat,
  whatsapp1: whatsapp1,
  whatsapp2: whatsapp2,
  whatsapp3: whatsapp3,
  isCaptcha: isCaptcha,
  isallSports: isallSports,
  AferLoginChangePassword: AferLoginChangePassword,
  isCasinoTab:isCasinoTab,
  isExchangeGames:isExchangeGames,
  ishorseRace:ishorseRace,
  origin:"cricbuzzer.io",
  domain:domain,
  currency:"BDT",
  auto:auto,
  isb2c:isb2c,
  isEtgcasino:isEtgcasino,
  isTraslate:isTraslate,
  affiliteLink:affiliteLink,
  isAffiliate:isAffiliate,
  isRemoveBfMarket:isRemoveBfMarket,
  isTrnNo:isTrnNo,
  isSocial: isSocial,
  LoginWithPhone:LoginWithPhone,
  isBlueOcean:isBlueOcean,

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
