let siteName = 'cricity';
let hostname = window.origin;
let apisUrl = "https://cricity.net/all_apis.json";
export const recaptcha = {
  siteKey: '6Lc6KH4rAAAAAEhIEONfFCCJ2Jr8jZ3aYGxFe1cK' // reCAPTCHA v3 site key
};

let isCaptcha = false;
let isallSports = true;
let isIcasino = false;
let isEtgcasino = true;
let isLcRouting = false;
let isCasinoTab = true;
let isb2c = true;
let isGoogle = true;
let isFacebook = true;
let isTelegram = true;
let isEmail = true;
let isMetamask = true;


let isMultiMarket = false;
let isDiamondCasino = true;
let isIntCasino = true;
let currency = '';
let auto = false;

let isExchangeGames = true;
let AferLoginChangePassword = true
let isTraslate = true
let whatsapp = '+00 00000 00000';
let whatsapp1 = '';
let whatsapp2 = '';
let whatsapp3 = '';
let whatsappChat = '';
let affiliteLink = ''
let isPoker = false;
let origin = "";
let domain = "";
let telegramBotName = ""
let isAffiliate = false;
let isRemoveBfMarket = true
let isTrnNo = false;
let isSocial = false;
let LoginWithPhone = false;
let isParlay = false;

let firebase = {
  apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
  authDomain: "cricity-fcda6.firebaseapp.com",
  projectId: "cricity-fcda6",
  storageBucket: "cricity-fcda6.firebasestorage.app",
  messagingSenderId: "131700140117",
  appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc"
};
let sitekey = ""

// --------------------------------------------------------------------------



if (hostname.indexOf('cricity.net') > -1) {
  siteName = 'cricity';
  origin = "cricity.net"
  isCaptcha = false;
  whatsapp = "+919819052222"
  whatsapp1 = "+919819062222";
  whatsappChat = '9819052222';
  //isRemoveBfMarket = false;
  isMultiMarket = true;
  isCasinoTab = false;
  affiliteLink = 'login.cricity.net'
  isAffiliate = true;
  domain = 'cricity.net';
  telegramBotName = 'cricbuzzer_bot';
  currency = 'INR';
  AferLoginChangePassword = false;

  firebase = {
    projectId: 'cricbuzzer-d42fe',
    appId: '1:445142658279:web:f367e9700079ec84160642',
    storageBucket: 'cricbuzzer-d42fe.appspot.com',
    apiKey: 'AIzaSyBdHBIDzWEcUaF4fQLv8xFzyAL7M3XbCPg',
    authDomain: 'cricbuzzer-d42fe.firebaseapp.com',
    messagingSenderId: '445142658279'
  },
  
  recaptcha.siteKey = '6Lc6KH4rAAAAAEhIEONfFCCJ2Jr8jZ3aYGxFe1cK';
  
}



if (hostname.indexOf('cricity.net') > -1) {
  siteName = 'cricity';
  origin = "cricity.net"
  isCaptcha = false;
  whatsapp = "+7977522278"
  whatsapp1 = "+9321362287";
  whatsappChat = '7977522278';
  //isRemoveBfMarket = false;
  isMultiMarket = true;
  isCasinoTab = false;
  domain = 'cricity.net';
  telegramBotName = 'cricbuzzerlive_bot'
  currency = 'INR';
  AferLoginChangePassword = false;
  LoginWithPhone = true;
    
  firebase = {
    apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
    authDomain: "cricity-fcda6.firebaseapp.com",
    projectId: "cricity-fcda6",
    storageBucket: "cricity-fcda6.firebasestorage.app",
    messagingSenderId: "131700140117",
    appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc"
  },
  recaptcha.siteKey = '6Lc6KH4rAAAAAEhIEONfFCCJ2Jr8jZ3aYGxFe1cK';
}

if (hostname.indexOf('cricity.net') > -1) {
  siteName = 'cricity';
  origin = "cricity.net"
  isCaptcha = false;
  whatsapp = "+919819052222"
  whatsapp1 = "+919819062222";
  whatsappChat = '9819052222';
  isRemoveBfMarket = false
  isMultiMarket = true,
    isCasinoTab = false
  firebase = {
    projectId: 'cricbuzzer-d42fe',
    appId: '1:445142658279:web:f367e9700079ec84160642',
    storageBucket: 'cricbuzzer-d42fe.appspot.com',
    apiKey: 'AIzaSyBdHBIDzWEcUaF4fQLv8xFzyAL7M3XbCPg',
    authDomain: 'cricbuzzer-d42fe.firebaseapp.com',
    messagingSenderId: '445142658279',
    
  },
  recaptcha.siteKey = '6Lc6KH4rAAAAAEhIEONfFCCJ2Jr8jZ3aYGxFe1cK';
}

if (hostname.indexOf('cricbuzzer.pro') > -1) {
  domain = 'cricbuzzer.pro';
  telegramBotName = 'cricbuzzer_pro_bot'
  currency = 'HKD';
  isPoker = true;

}
if (hostname.indexOf('cricbuzzer.com.bd') > -1) {
  siteName = 'cricbuzzerbd';


}
if (hostname.indexOf('cricbuzzer.com') > -1) {
  domain = 'cricbuzzer.com';
  siteName = 'cricbuzzercom';
  origin = "cricbuzzer.com"
  isCaptcha = false;
  isMultiMarket = true,
  isCasinoTab = false
  currency = 'INR'
  isb2c = false
  isTraslate = false;
  isEtgcasino = false;
  isParlay = true
}


if (hostname.indexOf('lionbook247.com') > -1) {
  domain = 'lionbook247.com';
  telegramBotName = 'lionbook247Bot'
  siteName = 'lionbook247';
  origin = "lionbook247.com"
  isCaptcha = false;
  isMultiMarket = true,
    isCasinoTab = false
  currency = 'INR'
  isb2c = false
  isTraslate = false;
  isEtgcasino = false;
}

export const environment = {
  firebase: firebase,
  recaptcha: {
    siteKey: '6Lc6KH4rAAAAAEhIEONfFCCJ2Jr8jZ3aYGxFe1cK',
  },
  production: true,
  apisUrl: apisUrl,
  siteName: siteName,
  isCaptcha: isCaptcha,
  whatsapp: whatsapp,
  whatsapp1: whatsapp1,
  whatsapp2: whatsapp2,
  whatsapp3: whatsapp3,
  isIcasino: isIcasino,
  isEtgcasino: isEtgcasino,
  isallSports: isallSports,
  AferLoginChangePassword: AferLoginChangePassword,
  isCasinoTab: isCasinoTab,
  isMultiMarket: isMultiMarket,
  isDiamondCasino: isDiamondCasino,
  isExchangeGames: isExchangeGames,
  isLcRouting: isLcRouting,
  telegramBotName: telegramBotName,
  origin: origin,
  domain: domain,
  currency: currency,
  isb2c: isb2c,
  sitekey: sitekey,
  whatsappChat: whatsappChat,
  isTraslate: isTraslate,
  auto: auto,
  isGoogle: isGoogle,
  isFacebook: isFacebook,
  isTelegram: isTelegram,
  isEmail: isEmail,
  isMetamask: isMetamask,
  affiliteLink: affiliteLink,
  isPoker: isPoker,
  isAffiliate: isAffiliate,
  isRemoveBfMarket: isRemoveBfMarket,
  isTrnNo: isTrnNo,
  isSocial: isSocial,
  LoginWithPhone: LoginWithPhone,
  isParlay: isParlay,
};
