exports.id = 535;
exports.ids = [535];
exports.modules = {

/***/ 4888:
/***/ ((module) => {

// Exports
module.exports = {
	"theForge_content": "theForge_theForge_content__L1qeB",
	"button_botton_box": "theForge_button_botton_box__Y2TXj",
	"theForge_content_wrapper": "theForge_theForge_content_wrapper__jbOCj",
	"second_component": "theForge_second_component__qpGsC",
	"third_component": "theForge_third_component__j4knl",
	"fourth_component": "theForge_fourth_component__6WBVz",
	"fifth_component": "theForge_fifth_component__MKJ7b",
	"glowingDivider": "theForge_glowingDivider__Z6k4o",
	"theForge": "theForge_theForge__kdeQN",
	"flipBook": "theForge_flipBook__NJwUI",
	"page": "theForge_page__l1C_V",
	"content_page": "theForge_content_page__Z9EcY",
	"page_left": "theForge_page_left__mE5yB",
	"page_left_wrapper": "theForge_page_left_wrapper__kFkwk",
	"page_left_wrapper_bottom": "theForge_page_left_wrapper_bottom__Fnsd7",
	"page_left_wrapper_text": "theForge_page_left_wrapper_text__RC40Z",
	"page_left_top": "theForge_page_left_top__LZf9H",
	"page_left_bottom": "theForge_page_left_bottom__9EaxZ",
	"page_p": "theForge_page_p__MWZTR",
	"imagePage": "theForge_imagePage__TBYPH",
	"page_image_top": "theForge_page_image_top__ADq8M",
	"image_front": "theForge_image_front__Tva8M",
	"video": "theForge_video__qL_cd",
	"theForge_cont": "theForge_theForge_cont__G5QvD",
	"title_text": "theForge_title_text__aWKhh",
	"theForgeContent": "theForge_theForgeContent__sk6tI",
	"lore_text": "theForge_lore_text__DPlyj",
	"medalsTitle": "theForge_medalsTitle__BD9PZ",
	"medalsText": "theForge_medalsText__2sYFI",
	"videoContainer": "theForge_videoContainer___Jv0p",
	"video_background": "theForge_video_background__XdUpv",
	"buttonContainer": "theForge_buttonContainer__LzGsD",
	"mute_button": "theForge_mute_button__fxGv0",
	"pause_button": "theForge_pause_button__bYEBC",
	"bottomLeft": "theForge_bottomLeft__osmu4",
	"bottomRight": "theForge_bottomRight__Jmu_D",
	"swiperContainer": "theForge_swiperContainer__cJXjm",
	"supply": "theForge_supply__H5uIG",
	"price": "theForge_price__j9aa2",
	"benefits": "theForge_benefits__m7Wok",
	"contentsList": "theForge_contentsList__Osg4J",
	"title": "theForge_title__6EyPb",
	"leader": "theForge_leader__Ip2L9",
	"pageNumber": "theForge_pageNumber__U7nIF",
	"iframe_box": "theForge_iframe_box__e9Bb8"
};


/***/ }),

/***/ 2535:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_pageflip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9938);
/* harmony import */ var react_pageflip__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_pageflip__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_NFTWallet_NFTWallet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8916);
/* harmony import */ var _components_componentsindex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9065);
/* harmony import */ var _Context_MyNFTDataContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1953);
/* harmony import */ var _styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4888);
/* harmony import */ var _styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_NFTWallet_NFTWallet__WEBPACK_IMPORTED_MODULE_3__, _components_componentsindex__WEBPACK_IMPORTED_MODULE_4__]);
([_components_NFTWallet_NFTWallet__WEBPACK_IMPORTED_MODULE_3__, _components_componentsindex__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);








const TheForgePage = ()=>{
    const { 0: bnbPrice , 1: setBnbPrice  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: isTermsModalOpen , 1: setIsTermsModalOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: isUserAgreementModalOpen , 1: setIsUserAgreementModalOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: isModalOpen , 1: setIsModalOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_6__.useRouter)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchBNBPrice = async ()=>{
            try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
                const data = await response.json();
                setBnbPrice(data.binancecoin.usd);
            } catch (error) {
                console.error("Failed to fetch BNB price:", error);
            }
        };
        fetchBNBPrice();
    }, []);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().theForge),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().theForge_content),
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().theForge_content_wrapper),
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title_text),
                        children: "THE FORGE OF DESTINY"
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().theForgeContent),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().lore_text),
                            children: "A LEGENDS LORE"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().medalsText),
                            children: [
                                "In the mythical land of Xdripia, a beacon of courage and relentless perseverance stands above all else:",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                    children: " The Forge of Destiny"
                                }),
                                ". This revered place, shrouded in mystery, is the ultimate arena where only the most steadfast and fearless warriors dare to tread. Here, champions face brutal trials, their mettle tested against both the elements and the fierce legacy of those who came before. This journey is not simply for glory but is a proving ground for the heart, strength, and unwavering loyalty to the people of Xdripia.",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                "Nestled within the unforgiving, jagged peaks of the IronForge Mountains, The Forge of Destiny remains hidden from those not called by destiny. The journey alone is the first trial—an arduous trek through treacherous ravines and chilling winds designed to strip away any pretenders. Only those with resilience in their hearts and fire in their spirits will emerge at the gates of the Forge, ready to face the ordeals within.",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                "The warriors who make it to the Forge are tasked with surviving a series of increasingly formidable challenges. Each test pushes them to the edge of their abilities, testing not only their strength but their courage, wisdom, and loyalty. These trials are set by the ancient guardians of Xdripia, remnants of an era when the land faced its greatest perils, including betrayal from within.",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                "In these dark times, Xdripia has seen betrayal from allies, sabotage from within, and the relentless assault of the Caller Syndicate—a ruthless coalition of traitors who seek to tear apart the unity of Xdripia. The Syndicate's attacks have left scars on both the land and its people. But with every strike from the enemy, the Forge produces a new champion, a beacon of hope to rally the people.",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("br", {}),
                                "For the few who emerge victorious from this sacred place, they earn more than glory—they earn the right to forge the ",
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                    children: "Medal of Honor"
                                }),
                                ". This medal is a sacred symbol, imbued with the memories of battles fought, and a promise to guard Xdripia against all foes, external and internal. Each medal represents not just a battle but a personal sacrifice and the resilience of those who fight for the freedom of Xdripia. Its existence binds the warrior to the ancient duty of defending their homeland, marking them among the most uncommon, rare, epic, and legendary heroes in history."
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().glowingDivider)
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_Context_MyNFTDataContext__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().second_component),
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().lore_text),
                                    children: "MEDALS OF HONOR VAULT"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .TheForge */ .Pc, {
                                    setIsModalOpen: setIsModalOpen
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().glowingDivider)
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().third_component),
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().lore_text),
                                    children: "YOUR MEDALS DISPLAY CASE"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_NFTWallet_NFTWallet__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {})
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().glowingDivider)
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().fourth_component),
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().lore_text),
                                    children: "A WARRIOR'S SPOILS"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((react_pageflip__WEBPACK_IMPORTED_MODULE_2___default()), {
                                    width: 500,
                                    height: 700,
                                    size: "stretch",
                                    minWidth: 315,
                                    maxWidth: 1000,
                                    minHeight: 700,
                                    maxHeight: 1533,
                                    maxShadowOpacity: 0.5,
                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().flipBook),
                                    drawShadow: false,
                                    flippingTime: 1000,
                                    usePortrait: true,
                                    startZIndex: 0,
                                    autoSize: true,
                                    mobileScrollSupport: false,
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_image_top),
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                    src: "/img/metal.webp",
                                                    alt: "Image 2",
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().image_front)
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().content_page),
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                                    children: "Table of Contents"
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().contentsList),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Common Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 1"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Common Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 2"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Uncommon Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 3"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Uncommon Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 4"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Rare Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 5"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Rare Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 6"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Epic Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 7"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Epic Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 8"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Legendary Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 9"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Legendary Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 10"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Eternal Tier Image"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 11"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Eternal Tier Details"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 12"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "XDRIP Holder Benefits"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 13"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().title),
                                                                    children: "Additional XDRIP Benefits"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().leader)
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().pageNumber),
                                                                    children: "Page 14"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-1.webp",
                                                            alt: "Image 1",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "I. COMMON TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 10,000 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 0.5 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "0.5 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(0.5 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "10% share of the revenue pool, the foundation of financial returns."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 0.50% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital artwork and collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-2.webp",
                                                            alt: "Image 2",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "II. UNCOMMON TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 5,000 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 1.0 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "1.0 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(1.0 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "25% cumulative revenue share, increasing financial returns."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "First-round invitations to participate in tokenized projects with a 5% discount on token purchase fees."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority on tickets for events and discounts on travel packages for attendees."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 1.00% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "5% revenue share bonus."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority seating at company events."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital artwork and collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-3.webp",
                                                            alt: "Image 3",
                                                            layout: "fill",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "III. RARE TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 2,500 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 1.5 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "1.5 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(1.5 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "45% of the revenue pool, creating substantial financial rewards."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "10% discount on token fees and priority access to fractionalized ownership projects such as small homes or premium rentals."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority on tickets for events and discounts on travel packages for attendees."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "One free ticket per year to any company-hosted event."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Statement:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Personalized quarterly reports on platform performance, projections, and revenue growth."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Community Voting:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Voting rights on company-driven initiatives and new tokenization projects."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 1.50% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "7% revenue share bonus."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority seating at company events."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-4.webp",
                                                            alt: "Image 4",
                                                            layout: "fill",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "IV. EPIC TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 1,000 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 2.0 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "2.0 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(2.0 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "70% of the revenue pool, establishing a high-tier investment."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Enhanced Discounts and Priority Access - Enjoy a 10% discount on token fees and priority access to fractionalized ownership projects, such as small homes or premium rentals."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority on tickets for events and discounts on travel packages for attendees."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "One free ticket per year to any company-hosted event, with VIP seating."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Statement:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Personalized quarterly reports on platform performance, projections, and revenue growth."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Community Voting:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Voting rights on company-driven initiatives and new tokenization projects."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 2.00% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "10% revenue share bonus."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority seating at company events."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-5.webp",
                                                            alt: "Image 5",
                                                            layout: "fill",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "V. LEGENDARY TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 500 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 2.5 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "2.5 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(2.5 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "100% cumulative revenue share."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "10% multiplier on annual revenue upon full-tier completion."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Premium Discounts and Investment Rights - Benefit from a 20% discount on purchase fees for high-demand tokenized projects and receive the first right of refusal on premium investments."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority on tickets for events and discounts on travel packages for attendees."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "One free ticket per year to any company-hosted event, with VIP seating and lounge access."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Statement:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Personalized quarterly reports on platform performance, projections, and revenue growth."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Community Voting:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Voting rights on company-driven initiatives and new tokenization projects."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 2.50% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "15% revenue share bonus."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority seating at company events."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_top),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                            src: "/img/nft-image-6.webp",
                                                            alt: "Image 5",
                                                            layout: "fill",
                                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().imagePage)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_bottom),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                                                children: "VI. ETERNAL TIER"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().supply),
                                                                children: "Supply: 20 Medals"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().price),
                                                                children: [
                                                                    "Price: 200 BNB",
                                                                    bnbPrice && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                        title: "200 BNB to USD",
                                                                        children: [
                                                                            "\xa0| ",
                                                                            `~$${(200 * bnbPrice).toLocaleString()} USD`
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper),
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Pool Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "100% cumulative revenue share."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "10% multiplier on annual revenue upon full-tier completion."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Tokenization Access:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Premium Discounts and Investment Rights - Benefit from a 20% discount on purchase fees for high-demand tokenized projects and receive the first right of refusal on premium investments."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Event Access:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Exclusive offers on XdRiP Fly Block Reservations and Hotel Arrangements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Livestream access to main events hosted by the company, including keynotes and announcements"
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority on tickets for events and discounts on travel packages for attendees."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "One free ticket per year to any company-hosted event, with VIP seating and lounge access."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Revenue Statement:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Personalized quarterly reports on platform performance, projections, and revenue growth."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Community Voting:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Voting rights on company-driven initiatives and new tokenization projects."
                                                                    })
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Unlocks XDRIP Holder Bonus:"
                                                                }),
                                                                " 2.50% XDRIP Tokens Supply",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "15% revenue share bonus."
                                                                        }),
                                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Priority seating at company events."
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                    children: "Collectible Perks:"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                        children: "Quarterly distribution of digital collectibles from partner collaborations."
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page)
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page),
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper_bottom),
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_left_wrapper_text),
                                                        children: "XDRIP Holder Benefits AND Incentives"
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().page_p),
                                                        children: "To encourage holders to invest in both NFTs and XDRIP, we offer unique bonuses for those who reach specific XDRIP thresholds, starting at 1% supply. These bonuses compound with each tier, adding up to 15% additional returns for holders of 5% of the total supply:"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                        className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().benefits),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                        children: "Own Common Tier + 0.5% Supply XDRIP Tokens:"
                                                                    }),
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                            children: "Early Insights - Receive early insights on upcoming tokenized projects, along with exclusive updates on new opportunities."
                                                                        })
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                        children: "Own UnCommon Tier + 1.0% Supply XDRIP Tokens:"
                                                                    }),
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "5% revenue share bonus."
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "Priority seating at company events."
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                        children: "Own Rare Tier + 1.5% Supply XDRIP Tokens:"
                                                                    }),
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "7% revenue share bonus."
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "Priority seating at company events."
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                        children: "Own Epic Tier + 2.0% Supply XDRIP Tokens:"
                                                                    }),
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "10% revenue share bonus."
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "Priority seating at company events."
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("strong", {
                                                                        children: "Own Legendary Tier + 2.5% Supply XDRIP Tokens:"
                                                                    }),
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "15% revenue share bonus."
                                                                            }),
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                                                children: "Priority seating at company events."
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().glowingDivider)
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().fifth_component),
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .SocialButtons */ .LO, {}),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: (_styles_theForge_module_css__WEBPACK_IMPORTED_MODULE_7___default().button_botton_box),
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                                            btnName: "Terms of Service",
                                            onClick: ()=>setIsTermsModalOpen(true),
                                            fontSize: "inherit",
                                            paddingLeft: "0",
                                            paddingRight: "0",
                                            isActive: false,
                                            setIsActive: ()=>{},
                                            title: "Terms of Service"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                                            btnName: "User Agreement",
                                            onClick: ()=>setIsUserAgreementModalOpen(true),
                                            fontSize: "inherit",
                                            paddingLeft: "0",
                                            paddingRight: "0",
                                            isActive: false,
                                            setIsActive: ()=>{},
                                            title: "User Agreement"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                                            btnName: "Owner Operations",
                                            onClick: ()=>router.push("/OwnerOpsPage"),
                                            fontSize: "inherit",
                                            paddingLeft: "0",
                                            paddingRight: "0",
                                            isActive: false,
                                            setIsActive: ()=>{},
                                            title: "Go to OwnerOps"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .TermsOfService */ .O$, {
                                    isOpen: isTermsModalOpen,
                                    onRequestClose: ()=>setIsTermsModalOpen(false)
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .UserAgreement */ .j3, {
                                    isOpen: isUserAgreementModalOpen,
                                    onRequestClose: ()=>setIsUserAgreementModalOpen(false)
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_componentsindex__WEBPACK_IMPORTED_MODULE_4__/* .WalkthroughModal */ .zw, {
                                    isOpen: isModalOpen,
                                    onRequestClose: ()=>setIsModalOpen(false)
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TheForgePage);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;