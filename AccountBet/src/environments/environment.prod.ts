let siteName = 'cricbuzzer';
let domain = 'cricbuzzer.io';
let hostname = window.origin;
let isCaptcha = true;
let isb2c = true
let whatsapp = '+00 00000 00000';
let whatsapp1 = '';
let isTraslate = true
let isUPI = true;
let isToastr = false;
let isAwcbets = false;
let isBObets = false

// --------------------------------------------------------------------------


if (hostname.indexOf('cricbuzzer.io') > -1) {
  siteName = 'cricbuzzer';
  isUPI = false;
  isBObets = true;
}

if (hostname.indexOf('cricbuzzer.live') > -1) {
  siteName = 'cricbuzzerlive';
  isUPI = false;
  isAwcbets = true;
  isBObets = true;
}




else if (hostname.indexOf('cricbuzzer.com.bd') > -1) {
  siteName = 'cricbuzzerbd';
}
if (hostname.indexOf('cricbuzzer.com') > -1) {
  siteName = 'cricbuzzercom';
  isb2c = false
  isTraslate = false;
  isAwcbets = true;
  isBObets = true;

}



if (hostname.indexOf('lionbook247.com') > -1) {
  siteName = 'lionbook247';
  isb2c = false
  isTraslate = false;

}


// marketing site end


export const environment = {
  production: true,
  apisUrl: "https://cricity.net/all_apis.json",
  siteName: siteName,
  isCaptcha: isCaptcha,
  whatsapp: whatsapp,
  whatsapp1: whatsapp1,
  domain: domain,
  isb2c: isb2c,
  isTraslate: isTraslate,
  isUPI: isUPI,
  isToastr: isToastr,
  isAwcbets: isAwcbets,
  isBObets: isBObets
};
