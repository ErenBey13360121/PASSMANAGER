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

/***/ "./src/connectors/webauthn-fallback.ts":
/*!*********************************************!*\
  !*** ./src/connectors/webauthn-fallback.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/connectors/common.ts");
const common_webauthn_1 = __webpack_require__(/*! ./common-webauthn */ "./src/connectors/common-webauthn.ts");
__webpack_require__(/*! ./webauthn.scss */ "./src/connectors/webauthn.scss");
let parsed = false;
let webauthnJson;
let parentUrl = null;
let sentSuccess = false;
let locale = "en";
let locales = {};
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
    }
    locale = common_1.getQsParam("locale").replace("-", "_");
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
    webauthnJson = dataObj.data;
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    parseParameters();
    try {
        locales = yield loadLocales(locale);
    }
    catch (_a) {
        // eslint-disable-next-line
        console.error("Failed to load the locale", locale);
        locales = yield loadLocales("en");
    }
    document.getElementById("msg").innerText = translate("webAuthnFallbackMsg");
    document.getElementById("remember-label").innerText = translate("rememberMe");
    const button = document.getElementById("webauthn-button");
    button.innerText = translate("webAuthnAuthenticate");
    button.onclick = start;
    document.getElementById("spinner").classList.add("d-none");
    const content = document.getElementById("content");
    content.classList.add("d-block");
    content.classList.remove("d-none");
}));
function loadLocales(newLocale) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = `locales/${newLocale}/messages.json?cache=${"7ts6bd"}`;
        const localesResult = yield fetch(filePath);
        return yield localesResult.json();
    });
}
function translate(id) {
    var _a;
    return ((_a = locales[id]) === null || _a === void 0 ? void 0 : _a.message) || "";
}
function start() {
    if (sentSuccess) {
        return;
    }
    if (!("credentials" in navigator)) {
        error(translate("webAuthnNotSupported"));
        return;
    }
    parseParameters();
    if (!webauthnJson) {
        error("No data.");
        return;
    }
    let json;
    try {
        json = common_webauthn_1.parseWebauthnJson(webauthnJson);
    }
    catch (e) {
        error("Cannot parse data.");
        return;
    }
    initWebAuthn(json);
}
function initWebAuthn(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assertedCredential = (yield navigator.credentials.get({
                publicKey: obj,
            }));
            if (sentSuccess) {
                return;
            }
            const dataString = common_webauthn_1.buildDataString(assertedCredential);
            const remember = document.getElementById("remember").checked;
            window.postMessage({ command: "webAuthnResult", data: dataString, remember: remember }, "*");
            sentSuccess = true;
            success(translate("webAuthnSuccess"));
        }
        catch (err) {
            error(err);
        }
    });
}
function error(message) {
    const el = document.getElementById("msg");
    resetMsgBox(el);
    el.textContent = message;
    el.classList.add("alert");
    el.classList.add("alert-danger");
}
function success(message) {
    document.getElementById("webauthn-button").disabled = true;
    const el = document.getElementById("msg");
    resetMsgBox(el);
    el.textContent = message;
    el.classList.add("alert");
    el.classList.add("alert-success");
}
function resetMsgBox(el) {
    el.classList.remove("alert");
    el.classList.remove("alert-danger");
    el.classList.remove("alert-success");
}


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/connectors/webauthn-fallback.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=webauthn-fallback.a42518522ff65522ee83.js.map