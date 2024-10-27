"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9806,3806],{99042:function(t,e,n){n.d(e,{W:function(){return r}});var s=n(22555),i=n(14848);class r extends i.Z{constructor(t){let{chains:e=s.gL9,options:n}=t;super(),this.chains=e,this.options=n}getBlockExplorerUrls(t){const e=t.explorers?.map((t=>t.url))??[];return e.length>0?e:void 0}isChainUnsupported(t){return!this.chains.some((e=>e.chainId===t))}updateChains(t){this.chains=t}}},70604:function(t,e,n){n.d(e,{A:function(){return o},C:function(){return c},R:function(){return h},S:function(){return d},U:function(){return u},a:function(){return a}});var s=n(28027);class i extends Error{constructor(t,e){const{cause:n,code:s,data:i}=e;if(!Number.isInteger(s))throw new Error('"code" must be an integer.');if(!t||"string"!==typeof t)throw new Error('"message" must be a nonempty string.');super(`${t}. Cause: ${JSON.stringify(n)}`),this.cause=n,this.code=s,this.data=i}}class r extends i{constructor(t,e){const{cause:n,code:s,data:i}=e;if(!(Number.isInteger(s)&&s>=1e3&&s<=4999))throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');super(t,{cause:n,code:s,data:i})}}class o extends Error{constructor(){super(...arguments),(0,s._)(this,"name","AddChainError"),(0,s._)(this,"message","Error adding chain")}}class c extends Error{constructor(t){let{chainId:e,connectorId:n}=t;super(`Chain "${e}" not configured for connector "${n}".`),(0,s._)(this,"name","ChainNotConfigured")}}class a extends Error{constructor(){super(...arguments),(0,s._)(this,"name","ConnectorNotFoundError"),(0,s._)(this,"message","Connector not found")}}class h extends i{constructor(t){super("Resource unavailable",{cause:t,code:-32002}),(0,s._)(this,"name","ResourceUnavailable")}}class d extends r{constructor(t){super("Error switching chain",{cause:t,code:4902}),(0,s._)(this,"name","SwitchChainError")}}class u extends r{constructor(t){super("User rejected request",{cause:t,code:4001}),(0,s._)(this,"name","UserRejectedRequestError")}}},53827:function(t,e,n){function s(t){return"string"===typeof t?Number.parseInt(t,"0x"===t.trim().substring(0,2)?16:10):"bigint"===typeof t?Number(t):t}n.d(e,{n:function(){return s}})},99806:function(t,e,n){n.r(e),n.d(e,{CoreWalletConnector:function(){return h}});var s=n(28027),i=n(70604),r=n(83743),o=n(3806),c=n(19485),a=n(19964);n(14848);class h extends o.InjectedConnector{constructor(t){const e={...{name:"Core Wallet",shimDisconnect:!0,shimChainChangedDisconnect:!0,getProvider:a.g},...t.options};super({chains:t.chains,options:e,connectorStorage:t.connectorStorage}),(0,s._)(this,"id",r.w.coreWallet)}async connect(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{const s=await this.getProvider();if(!s)throw new i.a;this.setupListeners(),this.emit("message",{type:"connecting"});let r=null;if(this.options?.shimDisconnect&&!Boolean(this.connectorStorage.getItem(this.shimDisconnectKey))){r=await this.getAccount().catch((()=>null));if(!!r)try{await s.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]})}catch(e){if(this.isUserRejectedRequestError(e))throw new i.U(e)}}if(!r){const t=await s.request({method:"eth_requestAccounts"});r=c.getAddress(t[0])}let o=await this.getChainId(),a=this.isChainUnsupported(o);if(t.chainId&&o!==t.chainId)try{await this.switchChain(t.chainId),o=t.chainId,a=this.isChainUnsupported(t.chainId)}catch(n){console.error(`Could not switch to chain id : ${t.chainId}`,n)}this.options?.shimDisconnect&&await this.connectorStorage.setItem(this.shimDisconnectKey,"true");const h={chain:{id:o,unsupported:a},provider:s,account:r};return this.emit("connect",h),h}catch(e){if(this.isUserRejectedRequestError(e))throw new i.U(e);if(-32002===e.code)throw new i.R(e);throw e}}async switchAccount(){const t=await this.getProvider();await t.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]})}}},3806:function(t,e,n){n.r(e),n.d(e,{InjectedConnector:function(){return l}});var s=n(28027),i=n(99042),r=n(70604),o=n(41538),c=n(17570),a=n(19485),h=n(241),d=n(16441),u=n(53827);n(14848);class l extends i.W{constructor(t){const e={...{shimDisconnect:!0,getProvider:()=>{if((0,o.a)(globalThis.window))return globalThis.window.ethereum}},...t.options};super({chains:t.chains,options:e}),(0,s._)(this,"shimDisconnectKey","injected.shimDisconnect"),(0,s._)(this,"onAccountsChanged",(async t=>{0===t.length?this.emit("disconnect"):this.emit("change",{account:a.getAddress(t[0])})})),(0,s._)(this,"onChainChanged",(t=>{const e=(0,u.n)(t),n=this.isChainUnsupported(e);this.emit("change",{chain:{id:e,unsupported:n}})})),(0,s._)(this,"onDisconnect",(async t=>{if(1013===t.code){if(await this.getProvider())try{if(await this.getAccount())return}catch{}}this.emit("disconnect"),this.options.shimDisconnect&&await this.connectorStorage.removeItem(this.shimDisconnectKey)}));const n=e.getProvider();if("string"===typeof e.name)this.name=e.name;else if(n){const t=function(t){if(!t)return"Injected";const e=t=>t.isAvalanche?"Core Wallet":t.isBitKeep?"BitKeep":t.isBraveWallet?"Brave Wallet":t.isCoinbaseWallet?"Coinbase Wallet":t.isExodus?"Exodus":t.isFrame?"Frame":t.isKuCoinWallet?"KuCoin Wallet":t.isMathWallet?"MathWallet":t.isOneInchIOSWallet||t.isOneInchAndroidWallet?"1inch Wallet":t.isOpera?"Opera":t.isPortal?"Ripio Portal":t.isTally?"Tally":t.isTokenPocket?"TokenPocket":t.isTokenary?"Tokenary":t.isTrust||t.isTrustWallet?"Trust Wallet":t.isMetaMask?"MetaMask":t.isImToken?"imToken":void 0;if(t.providers?.length){const n=new Set;let s=1;for(const r of t.providers){let t=e(r);t||(t=`Unknown Wallet #${s}`,s+=1),n.add(t)}const i=[...n];return i.length?i:i[0]??"Injected"}return e(t)??"Injected"}(n);e.name?this.name=e.name(t):this.name="string"===typeof t?t:t[0]}else this.name="Injected";this.id="injected",this.ready=!!n,this.connectorStorage=t.connectorStorage}async connect(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{const n=await this.getProvider();if(!n)throw new r.a;this.setupListeners(),this.emit("message",{type:"connecting"});const s=await n.request({method:"eth_requestAccounts"}),i=a.getAddress(s[0]);let o=await this.getChainId(),c=this.isChainUnsupported(o);if(t.chainId&&o!==t.chainId)try{await this.switchChain(t.chainId),o=t.chainId,c=this.isChainUnsupported(t.chainId)}catch(e){console.error(`Could not switch to chain id: ${t.chainId}`,e)}this.options.shimDisconnect&&await this.connectorStorage.setItem(this.shimDisconnectKey,"true");const h={account:i,chain:{id:o,unsupported:c},provider:n};return this.emit("connect",h),h}catch(n){if(this.isUserRejectedRequestError(n))throw new r.U(n);if(-32002===n.code)throw new r.R(n);throw n}}async disconnect(){const t=await this.getProvider();t?.removeListener&&(t.removeListener("accountsChanged",this.onAccountsChanged),t.removeListener("chainChanged",this.onChainChanged),t.removeListener("disconnect",this.onDisconnect),this.options.shimDisconnect&&await this.connectorStorage.removeItem(this.shimDisconnectKey))}async getAccount(){const t=await this.getProvider();if(!t)throw new r.a;const e=await t.request({method:"eth_accounts"});return a.getAddress(e[0])}async getChainId(){const t=await this.getProvider();if(!t)throw new r.a;return t.request({method:"eth_chainId"}).then(u.n)}async getProvider(){const t=this.options.getProvider();return t&&(this._provider=t),this._provider}async getSigner(){let{chainId:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[e,n]=await Promise.all([this.getProvider(),this.getAccount()]);return new h.Q(e,t).getSigner(n)}async isAuthorized(){try{if(this.options.shimDisconnect&&!Boolean(await this.connectorStorage.getItem(this.shimDisconnectKey)))return!1;if(!(await this.getProvider()))throw new r.a;return!!(await this.getAccount())}catch{return!1}}async switchChain(t){const e=await this.getProvider();if(!e)throw new r.a;const n=d.hexValue(t);try{await e.request({method:"wallet_switchEthereumChain",params:[{chainId:n}]});const s=this.chains.find((e=>e.chainId===t));return s||{chainId:t,name:`Chain ${n}`,slug:`${n}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpc:[""],chain:"",shortName:"",testnet:!0}}catch(s){const o=this.chains.find((e=>e.chainId===t));if(!o)throw new r.C({chainId:t,connectorId:this.id});if(4902===s.code||4902===s?.data?.originalError?.code)try{return await e.request({method:"wallet_addEthereumChain",params:[{chainId:n,chainName:o.name,nativeCurrency:o.nativeCurrency,rpcUrls:(0,c.g)(o),blockExplorerUrls:this.getBlockExplorerUrls(o)}]}),o}catch(i){if(this.isUserRejectedRequestError(i))throw new r.U(s);throw new r.A}if(this.isUserRejectedRequestError(s))throw new r.U(s);throw new r.S(s)}}async setupListeners(){const t=await this.getProvider();t.on&&(t.on("accountsChanged",this.onAccountsChanged),t.on("chainChanged",this.onChainChanged),t.on("disconnect",this.onDisconnect))}isUserRejectedRequestError(t){return 4001===t.code}}}}]);