/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/connectors/sso.scss":
/*!*********************************!*\
  !*** ./src/connectors/sso.scss ***!
  \*********************************/
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
/*!*******************************!*\
  !*** ./src/connectors/sso.ts ***!
  \*******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/connectors/common.ts");
__webpack_require__(/*! ./sso.scss */ "./src/connectors/sso.scss");
document.addEventListener("DOMContentLoaded", () => {
    const code = common_1.getQsParam("code");
    const state = common_1.getQsParam("state");
    if (state != null && state.includes(":clientId=browser")) {
        initiateBrowserSso(code, state);
    }
    else {
        window.location.href = window.location.origin + "/#/sso?code=" + code + "&state=" + state;
        // Match any characters between "_returnUri='" and the next "'"
        const returnUri = extractFromRegex(state, "(?<=_returnUri=')(.*)(?=')");
        if (returnUri) {
            window.location.href = window.location.origin + `/#${returnUri}`;
        }
        else {
            window.location.href = window.location.origin + "/#/sso?code=" + code + "&state=" + state;
        }
    }
});
function initiateBrowserSso(code, state) {
    window.postMessage({ command: "authResult", code: code, state: state }, "*");
    const handOffMessage = ("; " + document.cookie)
        .split("; ssoHandOffMessage=")
        .pop()
        .split(";")
        .shift();
    document.cookie = "ssoHandOffMessage=;SameSite=strict;max-age=0";
    const content = document.getElementById("content");
    content.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = handOffMessage;
    content.appendChild(p);
}
function extractFromRegex(s, regexString) {
    const regex = new RegExp(regexString);
    const results = regex.exec(s);
    if (!results) {
        return null;
    }
    return results[0];
}

})();

/******/ })()
;
//# sourceMappingURL=sso.11178239139f9fff734a.js.map