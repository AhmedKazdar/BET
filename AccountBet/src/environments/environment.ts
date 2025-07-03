// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let siteName = "cricbuzzercom";
let domain = "cricbuzzer.io";
let hostname = window.origin;
let isCaptcha=true;
let whatsapp = "+00 00000 00000";
let isb2c = true
let isTraslate = true
let isUPI = true;
let isToastr = true;
let isAwcbets = false;
let isBObets = false


export const environment = {
  production: false,
  siteName: siteName,
  apisUrl: "https://streamingtv.fun:3440/api/all_apis",
  domain:domain,
  isb2c:isb2c,
  isTraslate:isTraslate,
  isUPI:isUPI,
  isToastr:isToastr,
  isAwcbets:isAwcbets,
  isBObets:isBObets
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
