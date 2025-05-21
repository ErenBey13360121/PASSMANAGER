/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/connectors/common-webauthn.ts":
/*!*******************************************!*\
  !*** ./src/connectors/common-webauthn.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseWebauthnJson = exports.buildDataString = void 0;
function buildDataString(assertedCredential) {
    const response = assertedCredential.response;
    const authData = new Uint8Array(response.authenticatorData);
    const clientDataJSON = new Uint8Array(response.clientDataJSON);
    const rawId = new Uint8Array(assertedCredential.rawId);
    const sig = new Uint8Array(response.signature);
    const data = {
        id: assertedCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: assertedCredential.type,
        extensions: assertedCredential.getClientExtensionResults(),
        response: {
            authenticatorData: coerceToBase64Url(authData),
            clientDataJson: coerceToBase64Url(clientDataJSON),
            signature: coerceToBase64Url(sig),
        },
    };
    return JSON.stringify(data);
}
exports.buildDataString = buildDataString;
function parseWebauthnJson(jsonString) {
    const json = JSON.parse(jsonString);
    const challenge = json.challenge.replace(/-/g, "+").replace(/_/g, "/");
    json.challenge = Uint8Array.from(atob(challenge), (c) => c.charCodeAt(0));
    json.allowCredentials.forEach((listItem) => {
        // eslint-disable-next-line
        const fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
        listItem.id = Uint8Array.from(atob(fixedId), (c) => c.charCodeAt(0));
    });
    return json;
}
exports.parseWebauthnJson = parseWebauthnJson;
// From https://github.com/abergs/fido2-net-lib/blob/b487a1d47373ea18cd752b4988f7262035b7b54e/Demo/wwwroot/js/helpers.js#L34
// License: https://github.com/abergs/fido2-net-lib/blob/master/LICENSE.txt
function coerceToBase64Url(thing) {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
        thing = Uint8Array.from(thing);
    }
    if (thing instanceof ArrayBuffer) {
        thing = new Uint8Array(thing);
    }
    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
        let str = "";
        const len = thing.byteLength;
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
        }
        thing = window.btoa(str);
    }
    if (typeof thing !== "string") {
        throw new Error("could not coerce to string");
    }
    // base64 to base64url
    // NOTE: "=" at the end of challenge is optional, strip it off here
    thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");
    return thing;
}


/***/ }),

/***/ "./src/connectors/common.ts":
/*!**********************************!*\
  !*** ./src/connectors/common.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.b64Decode = exports.getQsParam = void 0;
function getQsParam(name) {
    const url = window.location.href;
    // eslint-disable-next-line
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
exports.getQsParam = getQsParam;
function b64Decode(str, spaceAsPlus = false) {
    if (spaceAsPlus) {
        str = str.replace(/ /g, "+");
    }
    return decodeURIComponent(Array.prototype.map
        .call(atob(str), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
        .join(""));
}
exports.b64Decode = b64Decode;


/***/ }),

/***/ "./src/connectors/webauthn.scss":
/*!**************************************!*\
  !*** ./src/connectors/webauthn.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!************************************!*\
  !*** ./src/connectors/webauthn.ts ***!
  \************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/connectors/common.ts");
const common_webauthn_1 = __webpack_require__(/*! ./common-webauthn */ "./src/connectors/common-webauthn.ts");
__webpack_require__(/*! ./webauthn.scss */ "./src/connectors/webauthn.scss");
const mobileCallbackUri = "bitwarden://webauthn-callback";
let parsed = false;
let webauthnJson;
let headerText = null;
let btnText = null;
let btnReturnText = null;
let parentUrl = null;
let parentOrigin = null;
let mobileResponse = false;
let stopWebAuthn = false;
let sentSuccess = false;
let obj = null;
document.addEventListener("DOMContentLoaded", () => {
    init();
    parseParameters();
    if (headerText) {
        const header = document.getElementById("webauthn-header");
        header.innerText = decodeURI(headerText);
    }
    if (btnText) {
        const button = document.getElementById("webauthn-button");
        button.innerText = decodeURI(btnText);
        button.onclick = executeWebAuthn;
    }
});
function init() {
    start();
    onMessage();
    info("ready");
}
function parseParameters() {
    if (parsed) {
        return;
    }
    parentUrl = common_1.getQsParam("parent");
    if (!parentUrl) {
        error("No parent.");
        return;
    }
    else {
        parentUrl = decodeURIComponent(parentUrl);
        parentOrigin = new URL(parentUrl).origin;
    }
    const version = common_1.getQsParam("v");
    if (version === "1") {
        parseParametersV1();
    }
    else {
        parseParametersV2();
    }
    parsed = true;
}
function parseParametersV1() {
    const data = common_1.getQsParam("data");
    if (!data) {
        error("No data.");
        return;
    }
    webauthnJson = common_1.b64Decode(data);
    headerText = common_1.getQsParam("headerText");
    btnText = common_1.getQsParam("btnText");
    btnReturnText = common_1.getQsParam("btnReturnText");
}
function parseParametersV2() {
    let dataObj = null;
    try {
        dataObj = JSON.parse(common_1.b64Decode(common_1.getQsParam("data")));
    }
    catch (e) {
        error("Cannot parse data.");
        return;
    }
    mobileResponse = dataObj.callbackUri != null || dataObj.mobile === true;
    webauthnJson = dataObj.data;
    headerText = dataObj.headerText;
    btnText = dataObj.btnText;
    btnReturnText = dataObj.btnReturnText;
}
function start() {
    sentSuccess = false;
    if (!("credentials" in navigator)) {
        error("WebAuthn is not supported in this browser.");
        return;
    }
    parseParameters();
    if (!webauthnJson) {
        error("No data.");
        return;
    }
    try {
        obj = common_webauthn_1.parseWebauthnJson(webauthnJson);
    }
    catch (e) {
        error("Cannot parse webauthn data.");
        return;
    }
    stopWebAuthn = false;
    if (mobileResponse ||
        (navigator.userAgent.indexOf(" Safari/") !== -1 && navigator.userAgent.indexOf("Chrome") === -1)) {
        // Safari and mobile chrome blocks non-user initiated WebAuthn requests.
    }
    else {
        executeWebAuthn();
    }
}
function executeWebAuthn() {
    if (stopWebAuthn) {
        return;
    }
    navigator.credentials.get({ publicKey: obj }).then(success).catch(error);
}
function onMessage() {
    window.addEventListener("message", (event) => {
        if (!event.origin || event.origin === "" || event.origin !== parentOrigin) {
            return;
        }
        if (event.data === "stop") {
            stopWebAuthn = true;
        }
        else if (event.data === "start" && stopWebAuthn) {
            start();
        }
    }, false);
}
function error(message) {
    if (mobileResponse) {
        document.location.replace(mobileCallbackUri + "?error=" + encodeURIComponent(message));
        returnButton(mobileCallbackUri + "?error=" + encodeURIComponent(message));
    }
    else {
        parent.postMessage("error|" + message, parentUrl);
    }
}
function success(assertedCredential) {
    if (sentSuccess) {
        return;
    }
    const dataString = common_webauthn_1.buildDataString(assertedCredential);
    if (mobileResponse) {
        document.location.replace(mobileCallbackUri + "?data=" + encodeURIComponent(dataString));
        returnButton(mobileCallbackUri + "?data=" + encodeURIComponent(dataString));
    }
    else {
        parent.postMessage("success|" + dataString, parentUrl);
        sentSuccess = true;
    }
}
function info(message) {
    if (mobileResponse) {
        return;
    }
    parent.postMessage("info|" + message, parentUrl);
}
function returnButton(uri) {
    // provides 'return' button in case scripted navigation is blocked
    const button = document.getElementById("webauthn-button");
    button.innerText = decodeURI(btnReturnText);
    button.onclick = () => {
        document.location.replace(uri);
    };
}

})();

/******/ })()
;
//# sourceMappingURL=webauthn.abaf3e80b83de7d72c63.js.map