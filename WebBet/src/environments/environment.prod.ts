let siteName = "cricity";
let hostname = window.origin;
let apisUrl = "https://cricity.net/all_apis.json";

let isCaptcha = false;
let isallSports = true;
let whatsapp = "+21623237006";
let whatsapp1 = "+21623237006";
let whatsapp2 = "+21623237006";
let whatsapp3 = "+21623237006"
let AferLoginChangePassword = true
let isCasinoTab = true;
let isExchangeGames = true
let ishorseRace = true
let telegramBotName = ""
let origin = "";
let domain = "";
let currency = "INR";
let auto = false;
let isb2c = true;
let whatsappChat ='';
let isEtgcasino = true;
let isTraslate = true
let affiliteLink = ''
let isAffiliate = false;
let isRemoveBfMarket = true
let isTrnNo = false;
let LoginWithPhone = false;
let isBlueOcean = false

let firebase = {
  projectId: 'cricbuzzer-d42fe',
  appId: '1:445142658279:web:f367e9700079ec84160642',
  storageBucket: 'cricbuzzer-d42fe.appspot.com',
  apiKey: 'AIzaSyBdHBIDzWEcUaF4fQLv8xFzyAL7M3XbCPg',
  authDomain: 'cricbuzzer-d42fe.firebaseapp.com',
  messagingSenderId: '445142658279',
  measurementId: 'G-DGDYH1GVXW',
};
let sitekey = ""
let isSocial = false



if (hostname.indexOf('cricbuzzer.io') > -1) {
  siteName = 'cricbuzzer';
  origin = "cricbuzzer.io"
  //isRemoveBfMarket = false;
  isCaptcha = false;
  whatsapp = "+21623237006"
  isAffiliate = true;
  whatsapp1 = "+21623237006";
  affiliteLink = 'login.cricbuzzer.io'
  whatsappChat = '21623237006';
  isBlueOcean = true
  firebase = {
    apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
    authDomain: "cricity-fcda6.firebaseapp.com",
    projectId: "cricity-fcda6",
    storageBucket: "cricity-fcda6.firebasestorage.app",
    messagingSenderId: "131700140117",
    appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc",
    measurementId: "G-DGDYH1GVXW"
  }
}

if (hostname.indexOf('cricity.net') > -1) {
  siteName = 'cricity';
  origin = "cricity.net"
  //isRemoveBfMarket = false;
  isCaptcha = false;
  whatsapp = "+7977522278"
  whatsapp1 = "+9321362287";
  whatsappChat = '7977522278';
  domain = 'cricity.net';
  telegramBotName = "cricbuzzerlive_bot"
  currency = "INR";
  LoginWithPhone =true;
  isBlueOcean = true;
  firebase = {
    apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
    authDomain: "cricity-fcda6.firebaseapp.com",
    projectId: "cricity-fcda6",
    storageBucket: "cricity-fcda6.firebasestorage.app",
    messagingSenderId: "131700140117",
    appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc",
    measurementId: "G-DGDYH1GVXW"
  }
}


if (hostname.indexOf('cric365.site') > -1) {
  siteName = 'cric365';
  origin = "cric365.site";
  isCaptcha = false;
  whatsapp = "+7977522278"
  whatsapp1 = "+9321362287";
  whatsappChat = '7977522278';
  domain = 'cric365.site';
  telegramBotName = "cricbuzzerlive_bot"
  currency = "INR";
  LoginWithPhone =true;
  isBlueOcean = true;
  firebase = {
    apiKey: "AIzaSyBjUNe1QHWagDa9D2nnAmfYcRIHwECATDs",
    authDomain: "cricity-fcda6.firebaseapp.com",
    projectId: "cricity-fcda6",
    storageBucket: "cricity-fcda6.firebasestorage.app",
    messagingSenderId: "131700140117",
    appId: "1:131700140117:web:9af0ed1cf25090d1e08cdc",
    measurementId: "G-DGDYH1GVXW"
  };

  
  apisUrl = "https://cric365.site/all_apis.json";
}

if (hostname.indexOf('cricbuzzer.io') > -1) {
  domain = 'cricbuzzer.io';
  telegramBotName = "cricbuzzer_bot"
  currency = "INR";
  AferLoginChangePassword = false;
  isBlueOcean = true;


}


if (hostname.indexOf('cricbuzzer.com') > -1) {
  domain = 'cricbuzzer.com';
  siteName = 'cricbuzzercom';
  origin = "cricbuzzer.com"
  isCaptcha = false;
  currency = 'INR'
  isb2c = false
  isTraslate = false;
  isEtgcasino = false;
  isBlueOcean = true;


}


if (hostname.indexOf('cricbuzzer.pro') > -1) {
  domain = 'cricbuzzer.pro';
  telegramBotName = 'cricbuzzer_pro_bot'
  currency = "HKD";
  

}


if (hostname.indexOf('lionbook247.com') > -1) {
  domain = 'lionbook247.com';
  telegramBotName = 'lionbook247Bot'
  siteName = 'lionbook247';
  origin = "lionbook247.com"
  isCaptcha = false;
  currency = 'INR'
  isb2c = false
  isTraslate = false;
  isEtgcasino = false;

}


export const environment = {
  firebase: firebase,
  recaptcha: {
    siteKey: '6LfXPpcjAAAAAHRJr1TKRVDyrQ7d5g-ZNdt-KgAB',
  },
  telegramBotName: telegramBotName,
  production: true,
  apisUrl: apisUrl,
  siteName: siteName,
  isCaptcha: isCaptcha,
  whatsapp: whatsapp,
  whatsapp1: whatsapp1,
  whatsapp2: whatsapp2,
  whatsapp3: whatsapp3,
  isallSports: isallSports,
  AferLoginChangePassword: AferLoginChangePassword,
  isCasinoTab: isCasinoTab,
  isExchangeGames: isExchangeGames,
  ishorseRace: ishorseRace,
  origin: origin,
  domain: domain,
  currency: currency,
  auto: auto,
  isb2c: isb2c,
  isEtgcasino: isEtgcasino,
  sitekey: sitekey,
  whatsappChat:whatsappChat,
  isTraslate:isTraslate,
  affiliteLink:affiliteLink,
  isAffiliate:isAffiliate,
  isRemoveBfMarket:isRemoveBfMarket,
  isTrnNo:isTrnNo,
  LoginWithPhone:LoginWithPhone,
  isSocial: isSocial,
  isBlueOcean:isBlueOcean,


};

