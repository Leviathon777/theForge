"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7844,9478],{77844:function(e,t,n){n.r(t),n.d(t,{ImTokenConnector:function(){return o}});var i=n(79478),s=n(25745);n(68457);class o extends i.InjectedConnector{constructor(e){const t={...{name:"imToken",getProvider(){function e(e){if(!!e?.isImToken)return e}if((0,s.a)(globalThis.window))return globalThis.window.ethereum?.providers?globalThis.window.ethereum.providers.find(e):e(globalThis.window.ethereum)}},...e.options};super({chains:e.chains,options:t,connectorStorage:e.connectorStorage})}}},79478:function(e,t,n){n.r(t),n.d(t,{InjectedConnector:function(){return l}});var i=n(37139),s=n(38168),o=n(81036),r=n(25745),c=n(84257),a=n(19485),h=n(241),d=n(16441),u=n(69977);n(68457);class l extends s.W{constructor(e){const t={...{shimDisconnect:!0,getProvider:()=>{if((0,r.a)(globalThis.window))return globalThis.window.ethereum}},...e.options};super({chains:e.chains,options:t}),(0,i._)(this,"shimDisconnectKey","injected.shimDisconnect"),(0,i._)(this,"onAccountsChanged",(async e=>{0===e.length?this.emit("disconnect"):this.emit("change",{account:a.getAddress(e[0])})})),(0,i._)(this,"onChainChanged",(e=>{const t=(0,u.n)(e),n=this.isChainUnsupported(t);this.emit("change",{chain:{id:t,unsupported:n}})})),(0,i._)(this,"onDisconnect",(async e=>{if(1013===e.code){if(await this.getProvider())try{if(await this.getAccount())return}catch{}}this.emit("disconnect"),this.options.shimDisconnect&&await this.connectorStorage.removeItem(this.shimDisconnectKey)}));const n=t.getProvider();if("string"===typeof t.name)this.name=t.name;else if(n){const e=function(e){if(!e)return"Injected";const t=e=>e.isAvalanche?"Core Wallet":e.isBitKeep?"BitKeep":e.isBraveWallet?"Brave Wallet":e.isCoinbaseWallet?"Coinbase Wallet":e.isExodus?"Exodus":e.isFrame?"Frame":e.isKuCoinWallet?"KuCoin Wallet":e.isMathWallet?"MathWallet":e.isOneInchIOSWallet||e.isOneInchAndroidWallet?"1inch Wallet":e.isOpera?"Opera":e.isPortal?"Ripio Portal":e.isTally?"Tally":e.isTokenPocket?"TokenPocket":e.isTokenary?"Tokenary":e.isTrust||e.isTrustWallet?"Trust Wallet":e.isMetaMask?"MetaMask":e.isImToken?"imToken":void 0;if(e.providers?.length){const n=new Set;let i=1;for(const o of e.providers){let e=t(o);e||(e=`Unknown Wallet #${i}`,i+=1),n.add(e)}const s=[...n];return s.length?s:s[0]??"Injected"}return t(e)??"Injected"}(n);t.name?this.name=t.name(e):this.name="string"===typeof e?e:e[0]}else this.name="Injected";this.id="injected",this.ready=!!n,this.connectorStorage=e.connectorStorage}async connect(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};try{const n=await this.getProvider();if(!n)throw new o.a;this.setupListeners(),this.emit("message",{type:"connecting"});const i=await n.request({method:"eth_requestAccounts"}),s=a.getAddress(i[0]);let r=await this.getChainId(),c=this.isChainUnsupported(r);if(e.chainId&&r!==e.chainId)try{await this.switchChain(e.chainId),r=e.chainId,c=this.isChainUnsupported(e.chainId)}catch(t){console.error(`Could not switch to chain id: ${e.chainId}`,t)}this.options.shimDisconnect&&await this.connectorStorage.setItem(this.shimDisconnectKey,"true");const h={account:s,chain:{id:r,unsupported:c},provider:n};return this.emit("connect",h),h}catch(n){if(this.isUserRejectedRequestError(n))throw new o.U(n);if(-32002===n.code)throw new o.R(n);throw n}}async disconnect(){const e=await this.getProvider();e?.removeListener&&(e.removeListener("accountsChanged",this.onAccountsChanged),e.removeListener("chainChanged",this.onChainChanged),e.removeListener("disconnect",this.onDisconnect),this.options.shimDisconnect&&await this.connectorStorage.removeItem(this.shimDisconnectKey))}async getAccount(){const e=await this.getProvider();if(!e)throw new o.a;const t=await e.request({method:"eth_accounts"});return a.getAddress(t[0])}async getChainId(){const e=await this.getProvider();if(!e)throw new o.a;return e.request({method:"eth_chainId"}).then(u.n)}async getProvider(){const e=this.options.getProvider();return e&&(this._provider=e),this._provider}async getSigner(){let{chainId:e}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[t,n]=await Promise.all([this.getProvider(),this.getAccount()]);return new h.Q(t,e).getSigner(n)}async isAuthorized(){try{if(this.options.shimDisconnect&&!Boolean(await this.connectorStorage.getItem(this.shimDisconnectKey)))return!1;if(!(await this.getProvider()))throw new o.a;return!!(await this.getAccount())}catch{return!1}}async switchChain(e){const t=await this.getProvider();if(!t)throw new o.a;const n=d.hexValue(e);try{await t.request({method:"wallet_switchEthereumChain",params:[{chainId:n}]});const i=this.chains.find((t=>t.chainId===e));return i||{chainId:e,name:`Chain ${n}`,slug:`${n}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpc:[""],chain:"",shortName:"",testnet:!0}}catch(i){const r=this.chains.find((t=>t.chainId===e));if(!r)throw new o.C({chainId:e,connectorId:this.id});if(4902===i.code||4902===i?.data?.originalError?.code)try{return await t.request({method:"wallet_addEthereumChain",params:[{chainId:n,chainName:r.name,nativeCurrency:r.nativeCurrency,rpcUrls:(0,c.g)(r),blockExplorerUrls:this.getBlockExplorerUrls(r)}]}),r}catch(s){if(this.isUserRejectedRequestError(s))throw new o.U(i);throw new o.A}if(this.isUserRejectedRequestError(i))throw new o.U(i);throw new o.S(i)}}async setupListeners(){const e=await this.getProvider();e.on&&(e.on("accountsChanged",this.onAccountsChanged),e.on("chainChanged",this.onChainChanged),e.on("disconnect",this.onDisconnect))}isUserRejectedRequestError(e){return 4001===e.code}}}}]);