"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 5478:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ MOHProvider)
/* harmony export */ });
/* unused harmony export MOHProviderContext */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var web3modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2840);
/* harmony import */ var web3modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(web3modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mohCA_ABI_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1996);
/* harmony import */ var _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8578);
/* harmony import */ var _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8519);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(web3__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1492);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1982);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2352);
/* harmony import */ var _thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_firestore__WEBPACK_IMPORTED_MODULE_6__]);
firebase_firestore__WEBPACK_IMPORTED_MODULE_6__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];










const web3 = new (web3__WEBPACK_IMPORTED_MODULE_5___default())((web3__WEBPACK_IMPORTED_MODULE_5___default().givenProvider));
const MohAddress = _mohCA_ABI_json__WEBPACK_IMPORTED_MODULE_3__/* .address */ .Lk;
const MohABI = _mohCA_ABI_json__WEBPACK_IMPORTED_MODULE_3__/* .abi */ .Mt;
const connectingWithSmartContract = async ()=>{
    try {
        const sdk = new ThirdwebSDK();
        await sdk.connect();
        const signer = sdk.getSigner();
        const contract = fetchMarketplaceContract(signer);
        return contract;
    } catch (error) {
        console.log("Something went wrong while connecting with contract", error);
    }
};
const fetchMohContract = (signerOrProvider)=>new ethers.Contract(MohAddress, MohABI, signerOrProvider);
const MOHProviderContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext();
const MOHProvider = ({ children  })=>{
    const titleData = "Discover, collect, and sell NFTs";
    const sdk = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__.useSDK)();
    const connect = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__.useConnect)();
    const address = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__.useAddress)();
    const connectionStatus = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_9__.useConnectionStatus)();
    const { 0: error , 1: setError  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const { 0: openError , 1: setOpenError  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: currentAccount , 1: setCurrentAccount  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const { 0: accountBalance , 1: setAccountBalance  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const { 0: nfts , 1: setNfts  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const { 0: searchNavQuery , 1: setSearchNavQuery  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_7__.useRouter)();
    const disconnectWallet = ()=>{
        setCurrentAccount(null);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (address) {
            setCurrentAccount(address);
            updateBalance();
        }
    }, [
        address
    ]);
    const updateBalance = async ()=>{
        if (sdk.provider && currentAccount) {
            const ethProvider = new ethers__WEBPACK_IMPORTED_MODULE_8__.ethers.providers.Web3Provider(sdk.provider);
            const getBalance = await ethProvider.getBalance(currentAccount);
            const bal = ethers__WEBPACK_IMPORTED_MODULE_8__.ethers.utils.formatEther(getBalance);
            setAccountBalance(bal);
        }
    };
    const checkIfWalletConnected = async ()=>{
        if (address) {
            setCurrentAccount(address);
            updateBalance();
        } else {
            console.log("No account");
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (connectionStatus === "connected") {
            checkIfWalletConnected();
        }
    }, [
        connectionStatus
    ]);
    const handleConnect = async ()=>{
        await connect();
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(MOHProviderContext.Provider, {
        value: {
            handleConnect,
            checkIfWalletConnected
        },
        children: children
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2581:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2352);
/* harmony import */ var _thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9915);
/* harmony import */ var _Context_MOHProviderContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5478);
/* harmony import */ var _components_componentsindex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9065);
/* harmony import */ var _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8578);
/* harmony import */ var _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_7__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_cookie__WEBPACK_IMPORTED_MODULE_4__, _Context_MOHProviderContext__WEBPACK_IMPORTED_MODULE_5__, _components_componentsindex__WEBPACK_IMPORTED_MODULE_6__]);
([js_cookie__WEBPACK_IMPORTED_MODULE_4__, _Context_MOHProviderContext__WEBPACK_IMPORTED_MODULE_5__, _components_componentsindex__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);









const MyApp = ({ Component , pageProps  })=>{
    const { 0: isModalVisible , 1: setIsModalVisible  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: hasEntered , 1: setHasEntered  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: useGuestWallet , 1: setUseGuestWallet  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: adminConnected , 1: setAdminConnected  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: adminWallet , 1: setAdminWallet  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const handleEnter = ()=>{
        setHasEntered(true);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const hasAcceptedCookies = js_cookie__WEBPACK_IMPORTED_MODULE_4__["default"].get("acceptedCookies");
        if (!hasAcceptedCookies) {
            setIsModalVisible(true);
        }
    }, []);
    const handleAccept = ()=>{
        js_cookie__WEBPACK_IMPORTED_MODULE_4__["default"].set("acceptedCookies", "true", {
            expires: 30
        });
        setIsModalVisible(false);
    };
    const handleDecline = ()=>{
        setIsModalVisible(false);
    };
    const connectAdminWallet = async ()=>{
        try {
            const adminWalletInstance = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.metamaskWallet)();
            await adminWalletInstance.connect();
            setAdminWallet(adminWalletInstance);
            console.log("Admin wallet connected:", adminWalletInstance.getAddress());
        } catch (error) {
            console.error("Error connecting admin wallet:", error);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        connectAdminWallet();
    }, []);
    const guestWallet = (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.smartWallet)({
        chain: _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.BinanceSmartChainTestnet,
        factoryAddress: "0xD4719eec1F39715BDD8a569D82171019E499d14f",
        sponsorGas: true,
        relayerUrl: "https://defender-api.openzeppelin.com/api/relayers/f1255de7-1212-4a51-a05b-c4b6aaaf05a5",
        headers: {
            "Authorization": "Bz313B8fzWGVEGb4jhYjBpWiY9h1FKzJ"
        },
        personalWallet: adminWallet
    });
    const wallets = [
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.inAppWallet)({
            persist: true
        }),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.metamaskWallet)({
            recommended: true
        }),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.trustWallet)(),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.phantomWallet)(),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.walletConnect)(),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.coinbaseWallet)(),
        (0,_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.localWallet)(), 
    ];
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: !hasEntered ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_6__/* .EntryPage */ .AA, {
            onEnter: handleEnter,
            isModalVisible: isModalVisible,
            handleAccept: handleAccept,
            handleDecline: handleDecline
        }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_thirdweb_dev_react__WEBPACK_IMPORTED_MODULE_2__.ThirdwebProvider, {
            activeChain: _thirdweb_dev_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.BinanceSmartChainTestnet,
            clientId: "409f3ba340001c9c25edd8567e0321c2",
            supportedWallets: useGuestWallet && guestWallet ? [
                guestWallet
            ] : wallets,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                            children: "Medals of HONOR by XdRiP"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                            name: "viewport",
                            content: "width=device-width, initial-scale=1.0"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                            name: "description",
                            content: "The Medals of Honor Collection by XdRiP Digital Management, LLC"
                        })
                    ]
                }),
                isModalVisible && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "welcomeMessageOverlay",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "welcomeMessageContent",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                children: "XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, affiliates, and others may use cookies to enhance your user experience..."
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                        onClick: handleAccept,
                                        children: "Accept All"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                        onClick: handleDecline,
                                        children: "Decline"
                                    })
                                ]
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Context_MOHProviderContext__WEBPACK_IMPORTED_MODULE_5__/* .MOHProvider */ .K, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                        ...pageProps
                    })
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7197:
/***/ ((module) => {

module.exports = require("@fortawesome/react-fontawesome");

/***/ }),

/***/ 2352:
/***/ ((module) => {

module.exports = require("@thirdweb-dev/react");

/***/ }),

/***/ 8578:
/***/ ((module) => {

module.exports = require("@thirdweb-dev/sdk");

/***/ }),

/***/ 1982:
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),

/***/ 4957:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 744:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/image-config-context.js");

/***/ }),

/***/ 5843:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/image-config.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 580:
/***/ ((module) => {

module.exports = require("prop-types");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 6290:
/***/ ((module) => {

module.exports = require("react-icons/fa");

/***/ }),

/***/ 9931:
/***/ ((module) => {

module.exports = require("react-modal");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 8519:
/***/ ((module) => {

module.exports = require("web3");

/***/ }),

/***/ 2840:
/***/ ((module) => {

module.exports = require("web3modal");

/***/ }),

/***/ 4563:
/***/ ((module) => {

module.exports = import("@fortawesome/free-solid-svg-icons");;

/***/ }),

/***/ 1492:
/***/ ((module) => {

module.exports = import("firebase/firestore");;

/***/ }),

/***/ 6197:
/***/ ((module) => {

module.exports = import("framer-motion");;

/***/ }),

/***/ 9915:
/***/ ((module) => {

module.exports = import("js-cookie");;

/***/ }),

/***/ 3590:
/***/ ((module) => {

module.exports = import("react-toastify");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [377,453,65], () => (__webpack_exec__(2581)));
module.exports = __webpack_exports__;

})();