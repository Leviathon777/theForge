"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[16],{90016:function(e,t,i){i.d(t,{A:function(){return u},D:function(){return p},E:function(){return T},R:function(){return g},U:function(){return I},W:function(){return d},a:function(){return w},b:function(){return h},c:function(){return m}});var n=i(37139),r=i(73934),s=i(48088),a=i(27349),o=i(56371),l=i(23437);const c=()=>"true"===localStorage.getItem("IS_THIRDWEB_DEV")?window.localStorage.getItem("THIRDWEB_DEV_URL")??"http://localhost:3000":"https://embedded-wallet.thirdweb.com",d=e=>`thirdwebEwsWalletUserDetails-${e}`,h=e=>`thirdwebEwsWalletUserId-${e}`,u=e=>`walletToken-${e}`,p=(e,t)=>`a-${e}-${t}`,w=e=>`a-${e}`;let g=function(e){return e.USER_MANAGED="USER_MANAGED",e.CLOUD_MANAGED="AWS_MANAGED",e}({}),m=function(e){return e.COGNITO="Cognito",e.GOOGLE="Google",e.EMAIL_OTP="EmailOtp",e.CUSTOM_JWT="CustomJWT",e.CUSTOM_AUTH_ENDPOINT="CustomAuthEndpoint",e.FACEBOOK="Facebook",e.APPLE="Apple",e.PASSKEY="Passkey",e.EXTERNAL_WALLET="ExternalWallet",e.DISCORD="Discord",e}({}),I=function(e){return e.LOGGED_OUT="Logged Out",e.LOGGED_IN_WALLET_UNINITIALIZED="Logged In, Wallet Uninitialized",e.LOGGED_IN_NEW_DEVICE="Logged In, New Device",e.LOGGED_IN_WALLET_INITIALIZED="Logged In, Wallet Initialized",e}({});const L=new Map;class E{constructor(e){let{clientId:t}=e;this.isSupported=!!window.localStorage,this.clientId=t}async getItem(e){return this.isSupported?window.localStorage.getItem(e):L.get(e)??null}async setItem(e,t){if(this.isSupported)return window.localStorage.setItem(e,t);L.set(e,t)}async removeItem(e){const t=await this.getItem(e);return!(!this.isSupported||!t)&&(window.localStorage.removeItem(e),!0)}async saveAuthCookie(e){await this.setItem(u(this.clientId),e)}async getAuthCookie(){return this.getItem(u(this.clientId))}async removeAuthCookie(){return this.removeItem(u(this.clientId))}async saveDeviceShare(e,t){await this.saveWalletUserId(t),await this.setItem(p(this.clientId,t),e)}async getDeviceShare(){const e=await this.getWalletUserId();return e?this.getItem(p(this.clientId,e)):null}async removeDeviceShare(){const e=await this.getWalletUserId();return!!e&&this.removeItem(p(this.clientId,e))}async getWalletUserId(){return this.getItem(h(this.clientId))}async saveWalletUserId(e){await this.setItem(h(this.clientId),e)}async removeWalletUserId(){return this.removeItem(h(this.clientId))}}function y(e){return new Promise((t=>{setTimeout(t,1e3*e)}))}const f={height:"100%",width:"100%",border:"none",backgroundColor:"transparent",colorScheme:"light",position:"fixed",top:"0px",right:"0px",zIndex:"2147483646",display:"none"},v=new Map;class S extends class{constructor(e){let{link:t,iframeId:i,container:r=document.body,iframeStyles:s,onIframeInitialize:a}=e;(0,n._)(this,"POLLING_INTERVAL_SECONDS",1.4),this.iframeBaseUrl=c();let o=document.getElementById(i);const l=new URL(t),d="2.5.39";if(l.searchParams.set("sdkVersion",d),!o||o.src!==l.href){if(!o){o=document.createElement("iframe");const e={...f,...s};Object.assign(o.style,e),o.setAttribute("id",i),o.setAttribute("fetchpriority","high"),r.appendChild(o)}o.src=l.href,o.setAttribute("data-version",d);const e=t=>{if("ewsIframeLoaded"===t.data.eventType){if(window.removeEventListener("message",e),!o)return void console.warn("thirdweb Iframe not found");this.onIframeLoadHandler(o,a)()}};window.addEventListener("message",e)}this.iframe=o}async onIframeLoadedInitVariables(){return{}}onIframeLoadHandler(e,t){return async()=>{const i=new Promise((async(i,n)=>{const r=new MessageChannel;r.port1.onmessage=s=>{const{data:a}=s;return r.port1.close(),a.success?(v.set(e.src,!0),t&&t(),i(!0)):n(new Error(a.error))};e?.contentWindow?.postMessage({eventType:"initIframe",data:await this.onIframeLoadedInitVariables()},this.iframeBaseUrl,[r.port2])}));await i}}async call(e){let{procedureName:t,params:i,showIframe:n=!1}=e;for(;!v.get(this.iframe.src);)await y(this.POLLING_INTERVAL_SECONDS);n&&(this.iframe.style.display="block",await y(.005));const r=new Promise(((e,r)=>{const s=new MessageChannel;s.port1.onmessage=async t=>{const{data:i}=t;s.port1.close(),n&&(await y(.1),this.iframe.style.display="none"),i.success?e(i.data):r(new Error(i.error))},this.iframe.contentWindow?.postMessage({eventType:t,data:i},this.iframeBaseUrl,[s.port2])}));return r}destroy(){v.delete(this.iframe.src)}}{constructor(e){let{clientId:t,customizationOptions:i}=e;super({iframeId:A,link:O({clientId:t,path:"/sdk/2022-08-12/embedded-wallet",queryParams:i}).href,container:document.body}),this.clientId=t}async onIframeLoadedInitVariables(){const e=new E({clientId:this.clientId});return{authCookie:await e.getAuthCookie(),deviceShareStored:await e.getDeviceShare(),walletUserId:await e.getWalletUserId(),clientId:this.clientId}}}function O(e){let{clientId:t,path:i,queryParams:n}=e;const r=new URL(`${i}`,c());if(n)for(const s of Object.keys(n))r.searchParams.set(s,n[s]?.toString()||"");return r.searchParams.set("clientId",t),r}const A="thirdweb-embedded-wallet-iframe";class D extends class{constructor(e){let{querier:t,preLogin:i,postLogin:n,clientId:r}=e;this.LoginQuerier=t,this.preLogin=i,this.postLogin=n,this.clientId=r}async sendEmailLoginOtp(e){let{email:t}=e;await this.preLogin();return await this.LoginQuerier.call({procedureName:"sendThirdwebEmailLoginOtp",params:{email:t}})}async sendSmsLoginOtp(e){let{phoneNumber:t}=e;await this.preLogin();return await this.LoginQuerier.call({procedureName:"sendThirdwebSmsLoginOtp",params:{phoneNumber:t}})}}{constructor(){super(...arguments),(0,n._)(this,"closeWindow",(e=>{let{isWindowOpenedByFn:t,win:i,closeOpenedWindow:n}=e;t?i?.close():i&&n?n(i):i&&i.close()}))}async getOauthLoginUrl(e){return await this.LoginQuerier.call({procedureName:"getHeadlessOauthLoginLink",params:{authProvider:e}})}async loginWithModal(){await this.preLogin();const e=await this.LoginQuerier.call({procedureName:"loginWithThirdwebModal",params:void 0,showIframe:!0});return this.postLogin(e)}async loginWithEmailOtp(e){let{email:t}=e;await this.preLogin();const i=await this.LoginQuerier.call({procedureName:"loginWithThirdwebModal",params:{email:t},showIframe:!0});return this.postLogin(i)}getOauthPopUpSizing(e){return e===m.FACEBOOK?"width=715, height=555":"width=350, height=500"}async loginWithOauth(e){let t=e?.openedWindow,i=!1;if(t||(t=window.open("","Login",this.getOauthPopUpSizing(e.oauthProvider)),i=!0),!t)throw new Error("Something went wrong opening pop-up");const[{loginLink:n}]=await Promise.all([this.getOauthLoginUrl(e.oauthProvider),this.preLogin()]);t.location.href=n;const r=await new Promise(((n,r)=>{const s=window.setInterval((async()=>{t&&t.closed&&(clearInterval(s),window.removeEventListener("message",a),r(new Error("User closed login window")))}),1e3),a=async o=>{if(o.origin===c())if("object"===typeof o.data)switch(o.data.eventType){case"userLoginSuccess":window.removeEventListener("message",a),clearInterval(s),this.closeWindow({isWindowOpenedByFn:i,win:t,closeOpenedWindow:e?.closeOpenedWindow}),o.data.authResult&&n(o.data.authResult);break;case"userLoginFailed":window.removeEventListener("message",a),clearInterval(s),this.closeWindow({isWindowOpenedByFn:i,win:t,closeOpenedWindow:e?.closeOpenedWindow}),r(new Error(o.data.error));break;case"injectDeveloperClientId":t?.postMessage({eventType:"injectDeveloperClientIdResult",developerClientId:this.clientId,authOption:e.oauthProvider},c())}else r(new Error("Invalid event data"))};window.addEventListener("message",a)}));return this.postLogin({storedToken:{...r.storedToken,shouldStoreCookieString:!0},walletDetails:{...r.walletDetails,isIframeStorageEnabled:!1}})}async loginWithCustomJwt(e){let{encryptionKey:t,jwt:i}=e;await this.preLogin();const n=await this.LoginQuerier.call({procedureName:"loginWithCustomJwt",params:{encryptionKey:t,jwt:i}});return this.postLogin(n)}async loginWithCustomAuthEndpoint(e){let{encryptionKey:t,payload:i}=e;await this.preLogin();const n=await this.LoginQuerier.call({procedureName:"loginWithCustomAuthEndpoint",params:{encryptionKey:t,payload:i}});return this.postLogin(n)}async verifyEmailLoginOtp(e){let{email:t,otp:i,recoveryCode:n}=e;const r=await this.LoginQuerier.call({procedureName:"verifyThirdwebEmailLoginOtp",params:{email:t,otp:i,recoveryCode:n}});return this.postLogin(r)}async verifySmsLoginOtp(e){let{phoneNumber:t,otp:i,recoveryCode:n}=e;const r=await this.LoginQuerier.call({procedureName:"verifyThirdwebSmsLoginOtp",params:{phoneNumber:t,otp:i,recoveryCode:n}});return this.postLogin(r)}}class _{constructor(e){let{clientId:t,querier:i,onAuthSuccess:n}=e;this.clientId=t,this.AuthQuerier=i,this.localStorage=new E({clientId:t}),this.onAuthSuccess=n,this.BaseLogin=new D({postLogin:async e=>this.postLogin(e),preLogin:async()=>{await this.preLogin()},querier:i,clientId:t})}async preLogin(){await this.logout()}async postLogin(e){let{storedToken:t,walletDetails:i}=e;t.shouldStoreCookieString&&await this.localStorage.saveAuthCookie(t.cookieString);return await this.onAuthSuccess({storedToken:t,walletDetails:i})}async loginWithModal(){return this.BaseLogin.loginWithModal()}async loginWithEmailOtp(e){return this.BaseLogin.loginWithEmailOtp(e)}async loginWithCustomJwt(e){return this.BaseLogin.loginWithCustomJwt(e)}async loginWithCustomAuthEndpoint(e){return this.BaseLogin.loginWithCustomAuthEndpoint(e)}async loginWithOauth(e){return this.BaseLogin.loginWithOauth(e)}async sendEmailLoginOtp(e){let{email:t}=e;return this.BaseLogin.sendEmailLoginOtp({email:t})}async sendSmsLoginOtp(e){let{phoneNumber:t}=e;return this.BaseLogin.sendSmsLoginOtp({phoneNumber:t})}async verifyEmailLoginOtp(e){return this.BaseLogin.verifyEmailLoginOtp(e)}async verifySmsLoginOtp(e){return this.BaseLogin.verifySmsLoginOtp(e)}async logout(){const{success:e}=await this.AuthQuerier.call({procedureName:"logout",params:void 0}),t=await this.localStorage.removeAuthCookie(),i=await this.localStorage.removeWalletUserId();return{success:e||t||i}}}class b extends s.Signer{constructor(e){let{provider:t,clientId:i,querier:r}=e;super(),(0,n._)(this,"DEFAULT_ETHEREUM_CHAIN_ID",5),this.clientId=i,this.querier=r,this.endpoint=t.connection?.url,(0,o.defineReadOnly)(this,"provider",t)}async getAddress(){const{address:e}=await this.querier.call({procedureName:"getAddress",params:void 0});return e}async signMessage(e){const{signedMessage:t}=await this.querier.call({procedureName:"signMessage",params:{message:e,chainId:(await(this.provider?.getNetwork()))?.chainId??this.DEFAULT_ETHEREUM_CHAIN_ID,rpcEndpoint:this.endpoint}});return t}async signTransaction(e){const{signedTransaction:t}=await this.querier.call({procedureName:"signTransaction",params:{transaction:e,chainId:(await(this.provider?.getNetwork()))?.chainId??this.DEFAULT_ETHEREUM_CHAIN_ID,rpcEndpoint:this.endpoint}});return t}async sendTransaction(e){if(!this.provider)throw new Error("Provider not found");const t={...await(0,l.g)(this.provider),...e};return super.sendTransaction(t)}async _signTypedData(e,t,i){const{signedTypedData:n}=await this.querier.call({procedureName:"signTypedDataV4",params:{domain:e,types:t,message:i,chainId:(await(this.provider?.getNetwork()))?.chainId??this.DEFAULT_ETHEREUM_CHAIN_ID,rpcEndpoint:this.endpoint}});return n}connect(e){return new b({clientId:this.clientId,provider:e,querier:this.querier})}}class N{constructor(e){let{clientId:t,chain:i,querier:n}=e;this.clientId=t,this.chain=i,this.walletManagerQuerier=n,this.localStorage=new E({clientId:t})}async postWalletSetUp(e){let{deviceShareStored:t,walletAddress:i,isIframeStorageEnabled:n,walletUserId:r}=e;return n||await this.localStorage.saveDeviceShare(t,r),{walletAddress:i}}async getUserWalletStatus(){const e=await this.walletManagerQuerier.call({procedureName:"getUserStatus",params:void 0});return e.status===I.LOGGED_IN_WALLET_INITIALIZED?{status:I.LOGGED_IN_WALLET_INITIALIZED,...e.user,wallet:this}:e.status===I.LOGGED_IN_NEW_DEVICE||e.status===I.LOGGED_IN_WALLET_UNINITIALIZED?{status:I.LOGGED_IN_WALLET_UNINITIALIZED,...e.user}:{status:e.status}}async setChain(e){let{chain:t}=e;this.chain=t}async getEthersJsSigner(e){return new b({clientId:this.clientId,provider:(0,a.getDefaultProvider)(e?.rpcEndpoint??r.g1[this.chain]),querier:this.walletManagerQuerier})}}class T{isClientIdLegacyPaper(e){return e.indexOf("-")>0&&36===e.length}constructor(e){let{clientId:t,chain:i,styles:n,onAuthSuccess:r}=e;if(this.isClientIdLegacyPaper(t))throw new Error("You are using a legacy clientId. Please use the clientId found on the thirdweb dashboard settings page");this.clientId=t,this.querier=new S({clientId:t,customizationOptions:n}),this.wallet=new N({clientId:t,chain:i,querier:this.querier}),this.auth=new _({clientId:t,querier:this.querier,onAuthSuccess:async e=>(r?.(e),await this.wallet.postWalletSetUp({...e.walletDetails,walletUserId:e.storedToken.authDetails.userWalletId}),await this.querier.call({procedureName:"initIframe",params:{deviceShareStored:e.walletDetails.deviceShareStored,clientId:this.clientId,walletUserId:e.storedToken.authDetails.userWalletId,authCookie:e.storedToken.cookieString}}),{user:{status:I.LOGGED_IN_WALLET_INITIALIZED,authDetails:e.storedToken.authDetails,wallet:this.wallet,walletAddress:e.walletDetails.walletAddress}})})}async getUser(){return this.wallet.getUserWalletStatus()}}},73934:function(e,t,i){i.d(t,{OB:function(){return r},g1:function(){return n}});var n={Ethereum:"https://ethereum.rpc.thirdweb.com",Goerli:"https://goerli.rpc.thirdweb.com",Mumbai:"https://mumbai.rpc.thirdweb.com",Polygon:"https://polygon.rpc.thirdweb.com",Avalanche:"https://avalanche.rpc.thirdweb.com",Optimism:"https://optimism.rpc.thirdweb.com",OptimismGoerli:"https://optimism-goerli.rpc.thirdweb.com",BSC:"https://binance.rpc.thirdweb.com",BSCTestnet:"https://binance-testnet.rpc.thirdweb.com",ArbitrumOne:"https://arbitrum.rpc.thirdweb.com",ArbitrumGoerli:"https://arbitrum-goerli.rpc.thirdweb.com",Fantom:"https://fantom.rpc.thirdweb.com",FantomTestnet:"https://fantom-testnet.rpc.thirdweb.com",Sepolia:"https://sepolia.rpc.thirdweb.com",AvalancheFuji:"https://avalanche-fuji.rpc.thirdweb.com"},r=()=>{var e;return"undefined"!=typeof window&&"true"===window.localStorage.getItem("IS_PAPER_DEV")?null!=(e=window.localStorage.getItem("PAPER_DEV_URL"))?e:"http://localhost:3000":"undefined"!=typeof window&&window.location.origin.includes("paper.xyz")||"undefined"!=typeof window&&window.location.origin.includes("thirdweb.com")?window.location.origin:"https://withpaper.com"}}}]);