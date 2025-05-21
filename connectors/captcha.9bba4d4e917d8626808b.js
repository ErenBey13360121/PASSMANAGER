/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/connectors/captcha.ts":
/*!***********************************!*\
  !*** ./src/connectors/captcha.ts ***!
  \***********************************/
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
if (window.location.pathname.includes("mobile")) {
    __webpack_require__(/*! ./captcha-mobile.scss */ "./src/connectors/captcha-mobile.scss");
}
else {
    __webpack_require__(/*! ./captcha.scss */ "./src/connectors/captcha.scss");
}
document.addEventListener("DOMContentLoaded", () => {
    init();
});
window.captchaSuccess = captchaSuccess;
window.captchaError = captchaError;
let parentUrl = null;
let parentOrigin = null;
let mobileResponse = null;
let sentSuccess = false;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield start();
        onMessage();
    });
}
function start() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        sentSuccess = false;
        const data = common_1.getQsParam("data");
        if (!data) {
            error("No data.");
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
        let decodedData;
        try {
            decodedData = JSON.parse(common_1.b64Decode(data, true));
        }
        catch (e) {
            error("Cannot parse data.");
            return;
        }
        mobileResponse = decodedData.callbackUri != null || decodedData.mobile === true;
        let src = "https://hcaptcha.com/1/api.js?render=explicit";
        // Set language code
        if (decodedData.locale) {
            src += `&hl=${(_a = encodeURIComponent(decodedData.locale)) !== null && _a !== void 0 ? _a : "en"}`;
        }
        // Set captchaRequired subtitle for mobile
        const subtitleEl = document.getElementById("captchaRequired");
        if (decodedData.captchaRequiredText && subtitleEl) {
            subtitleEl.textContent = decodedData.captchaRequiredText;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", () => {
            hcaptcha.render("captcha", {
                sitekey: encodeURIComponent(decodedData.siteKey),
                callback: "captchaSuccess",
                "error-callback": "captchaError",
            });
            watchHeight();
        });
        document.head.appendChild(script);
    });
}
function captchaSuccess(response) {
    if (mobileResponse) {
        document.location.replace("bitwarden://captcha-callback?token=" + encodeURIComponent(response));
    }
    else {
        success(response);
    }
}
function captchaError() {
    error("An error occurred with the captcha. Try again.");
}
function onMessage() {
    window.addEventListener("message", (event) => {
        if (!event.origin || event.origin === "" || event.origin !== parentOrigin) {
            return;
        }
        if (event.data === "start") {
            start();
        }
    }, false);
}
function error(message) {
    parent.postMessage("error|" + message, parentUrl);
}
function success(data) {
    if (sentSuccess) {
        return;
    }
    parent.postMessage("success|" + data, parentUrl);
    sentSuccess = true;
}
function info(message) {
    parent.postMessage("info|" + JSON.stringify(message), parentUrl);
}
function watchHeight() {
    return __awaiter(this, void 0, void 0, function* () {
        const imagesDiv = document.body.lastChild;
        // eslint-disable-next-line
        while (true) {
            info({
                height: imagesDiv.style.visibility === "hidden"
                    ? document.documentElement.offsetHeight
                    : document.documentElement.scrollHeight,
                width: document.documentElement.scrollWidth,
            });
            yield sleep(100);
        }
    });
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((r) => setTimeout(r, ms));
    });
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

/***/ "./src/connectors/captcha-mobile.scss":
/*!********************************************!*\
  !*** ./src/connectors/captcha-mobile.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/connectors/captcha.scss":
/*!*************************************!*\
  !*** ./src/connectors/captcha.scss ***!
  \*************************************/
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/connectors/captcha.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=captcha.9bba4d4e917d8626808b.js.map