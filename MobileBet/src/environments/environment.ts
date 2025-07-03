// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let siteName = "cricbuzzercom";
let hostname = window.origin;
let origin = "";
let domain = "cricity.net";
let apisUrl = "https://cricity.net/all_apis.json";

let isCaptcha = false;
let isallSports = true;
let isEtgcasino = true;
let isLcRouting = false;
let isb2c = true;
let auto = false
let currency = 'USD';
let isBlueOcean= true


let isCasinoTab = false;
let isMultiMarket = true;
let isDiamondCasino = true;
let isIntCasino = true;

let isExchangeGames = true;
let isTraslate = true
let whatsapp = "+00 00000 00000";
let whatsapp1 = "";
let whatsapp2 = " "
let whatsapp3 = '+15072012580';
let AferLoginChangePassword = false
let telegramBotName = ""
let whatsappChat =''
let isGoogle = true;
let isFacebook = true;
let isTelegram = true;
let isEmail = true;
let isMetamask = true;
let affiliteLink = ''
let isPoker = true;
let isAffiliate = true
let isRemoveBfMarket = true
let isTrnNo = true;
let isSocial = true;
let LoginWithPhone = true;
let isParlay = true;

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
  isCaptcha: isCaptcha,
  whatsapp: whatsapp,
  whatsapp1: whatsapp1,
  whatsapp2: whatsapp2,
  whatsapp3: whatsapp3,
  isEtgcasino: isEtgcasino,
  isallSports: isallSports,
  AferLoginChangePassword: AferLoginChangePassword,
  isCasinoTab: isCasinoTab,
  isMultiMarket: isMultiMarket,
  isDiamondCasino: isDiamondCasino,
  isExchangeGames: isExchangeGames,
  isLcRouting: isLcRouting,
  currency:currency,
  isb2c:isb2c,
  auto:auto,
  origin:"cricity.net",
  domain:domain,
  whatsappChat:whatsappChat,
  isTraslate:isTraslate,
  isGoogle : isGoogle,
  isFacebook : isFacebook,
  isTelegram :isTelegram,
  isEmail :isEmail,
  isMetamask :isMetamask,
  affiliteLink:affiliteLink,
  isPoker:isPoker,
  isAffiliate:isAffiliate,
  isRemoveBfMarket: isRemoveBfMarket,
  isTrnNo:isTrnNo,
  isSocial: isSocial,
  LoginWithPhone: LoginWithPhone,
  isParlay: isParlay,
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
