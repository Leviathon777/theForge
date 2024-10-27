"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8627],{69977:function(e,t,i){function n(e){return"string"===typeof e?Number.parseInt(e,"0x"===e.trim().substring(0,2)?16:10):"bigint"===typeof e?Number(e):e}i.d(t,{n:function(){return n}})},68627:function(e,t,i){i.r(t),i.d(t,{EmbeddedWalletConnector:function(){return c}});var n=i(37139),r=i(19485),s=i(69977),a=i(2850),o=i(38569),h=i(90016);i(68457);class c extends o.C{constructor(e){super(),(0,n._)(this,"id",a.w.paper),(0,n._)(this,"name","Embedded Wallet"),(0,n._)(this,"ready",!0),(0,n._)(this,"user",null),(0,n._)(this,"onAccountsChanged",(async e=>{0===e.length?await this.onDisconnect():this.emit("change",{account:r.getAddress(e[0])})})),(0,n._)(this,"onChainChanged",(e=>{const t=(0,s.n)(e),i=-1===this.options.chains.findIndex((e=>e.chainId===t));this.emit("change",{chain:{id:t,unsupported:i}})})),(0,n._)(this,"onDisconnect",(async()=>{this.emit("disconnect")})),this.options=e}getEmbeddedWalletSDK(){return this._embeddedWalletSdk||(this._embeddedWalletSdk=new h.E({clientId:this.options.clientId,chain:"Ethereum",onAuthSuccess:this.options.onAuthSuccess})),this._embeddedWalletSdk}async connect(e){if(e){if(!e.authResult)throw new Error("Missing authData - call authenticate() first with your authentication strategy");if(!e.authResult.user)throw new Error("Missing authData.user - call authenticate() first with your authentication strategy");this.user=e.authResult.user}else{const e=await this.authenticate({strategy:"iframe"});if(!e.user)throw new Error("Error connecting User");this.user=e.user}return e?.chainId&&this.switchChain(e.chainId),this.getAddress()}async disconnect(){const e=this._embeddedWalletSdk;await(e?.auth.logout()),this._signer=void 0,this._embeddedWalletSdk=void 0,this.user=null}async getAddress(){if(!this.user)throw new Error("Embedded Wallet is not connected");return await this.getSigner().then((e=>e.getAddress()))}async isConnected(){try{return!!(await this.getAddress())}catch(e){return!1}}async getProvider(){const e=await this.getSigner();if(!e.provider)throw new Error("Provider not found");return e.provider}async getSigner(){if(this._signer)return this._signer;const e=await this.getUser(),t=await e.wallet.getEthersJsSigner({rpcEndpoint:this.options.chain.rpc[0]||""});if(!t)throw new Error("Signer not found");return this._signer=t,t}async isAuthorized(){return!1}async switchChain(e){const t=this.options.chains.find((t=>t.chainId===e));if(!t)throw new Error("Chain not configured");try{await(this.user?.wallet.setChain({chain:"Ethereum"})),this._signer=await(this.user?.wallet.getEthersJsSigner({rpcEndpoint:t.rpc[0]||""})),this.emit("change",{chain:{id:e,unsupported:!1}})}catch(i){console.warn("Failed to switch chain",i)}}async setupListeners(){return Promise.resolve()}updateChains(e){this.options.chains=e}async getUser(){if(!this.user||!this.user.wallet||!this.user.wallet.getEthersJsSigner){const e=this.getEmbeddedWalletSDK(),t=await e.getUser();if(t.status!==h.U.LOGGED_IN_WALLET_INITIALIZED)throw new Error("Embedded Wallet is not authenticated, please authenticate first");this.user=t}return this.user}async getEmail(){return(await this.getUser()).authDetails.email}async getPhoneNumber(){return(await this.getUser()).authDetails.phoneNumber}async getRecoveryInformation(){return(await this.getUser()).authDetails}async sendVerificationEmail(e){let{email:t}=e;return this.getEmbeddedWalletSDK().auth.sendEmailLoginOtp({email:t})}async sendVerificationSms(e){let{phoneNumber:t}=e;return this.getEmbeddedWalletSDK().auth.sendSmsLoginOtp({phoneNumber:t})}async authenticate(e){const t=this.getEmbeddedWalletSDK(),i=e.strategy;switch(i){case"email_verification":return await t.auth.verifyEmailLoginOtp({email:e.email,otp:e.verificationCode,recoveryCode:e.recoveryCode});case"phone_number_verification":return await t.auth.verifySmsLoginOtp({phoneNumber:e.phoneNumber,otp:e.verificationCode,recoveryCode:e.recoveryCode});case"apple":case"facebook":case"google":{const n=u[i];return t.auth.loginWithOauth({oauthProvider:n,closeOpenedWindow:e.closeOpenedWindow,openedWindow:e.openedWindow})}case"jwt":return t.auth.loginWithCustomJwt({jwt:e.jwt,encryptionKey:e.encryptionKey});case"auth_endpoint":return t.auth.loginWithCustomAuthEndpoint({payload:e.payload,encryptionKey:e.encryptionKey});case"iframe_email_verification":return t.auth.loginWithEmailOtp({email:e.email});case"iframe":return t.auth.loginWithModal();default:!function(e){throw new Error("Invalid param: "+e)}(i)}}}const u={google:h.c.GOOGLE,facebook:h.c.FACEBOOK,apple:h.c.APPLE}}}]);