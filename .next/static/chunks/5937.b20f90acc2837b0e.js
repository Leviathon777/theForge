"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5937],{99042:function(t,e,n){n.d(e,{W:function(){return i}});var s=n(22555),r=n(14848);class i extends r.Z{constructor(t){let{chains:e=s.gL9,options:n}=t;super(),this.chains=e,this.options=n}getBlockExplorerUrls(t){const e=t.explorers?.map((t=>t.url))??[];return e.length>0?e:void 0}isChainUnsupported(t){return!this.chains.some((e=>e.chainId===t))}updateChains(t){this.chains=t}}},70604:function(t,e,n){n.d(e,{A:function(){return o},C:function(){return c},R:function(){return h},S:function(){return d},U:function(){return u},a:function(){return a}});var s=n(28027);class r extends Error{constructor(t,e){const{cause:n,code:s,data:r}=e;if(!Number.isInteger(s))throw new Error('"code" must be an integer.');if(!t||"string"!==typeof t)throw new Error('"message" must be a nonempty string.');super(`${t}. Cause: ${JSON.stringify(n)}`),this.cause=n,this.code=s,this.data=r}}class i extends r{constructor(t,e){const{cause:n,code:s,data:r}=e;if(!(Number.isInteger(s)&&s>=1e3&&s<=4999))throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');super(t,{cause:n,code:s,data:r})}}class o extends Error{constructor(){super(...arguments),(0,s._)(this,"name","AddChainError"),(0,s._)(this,"message","Error adding chain")}}class c extends Error{constructor(t){let{chainId:e,connectorId:n}=t;super(`Chain "${e}" not configured for connector "${n}".`),(0,s._)(this,"name","ChainNotConfigured")}}class a extends Error{constructor(){super(...arguments),(0,s._)(this,"name","ConnectorNotFoundError"),(0,s._)(this,"message","Connector not found")}}class h extends r{constructor(t){super("Resource unavailable",{cause:t,code:-32002}),(0,s._)(this,"name","ResourceUnavailable")}}class d extends i{constructor(t){super("Error switching chain",{cause:t,code:4902}),(0,s._)(this,"name","SwitchChainError")}}class u extends i{constructor(t){super("User rejected request",{cause:t,code:4001}),(0,s._)(this,"name","UserRejectedRequestError")}}},53827:function(t,e,n){function s(t){return"string"===typeof t?Number.parseInt(t,"0x"===t.trim().substring(0,2)?16:10):"bigint"===typeof t?Number(t):t}n.d(e,{n:function(){return s}})},35937:function(t,e,n){n.r(e),n.d(e,{BloctoConnector:function(){return p}});var s=n(28027),r=n(99042),i=n(70604),o=n(41477),c=n(19485),a=n(241),h=n(16441),d=n(83743),u=n(17570),g=n(53827);n(14848);class p extends r.W{constructor(t){let{chains:e,options:n={}}=t;super({chains:e,options:n}),(0,s._)(this,"id",d.w.blocto),(0,s._)(this,"name","Blocto"),(0,s._)(this,"ready",!0),this._onAccountsChangedBind=this.onAccountsChanged.bind(this),this._onChainChangedBind=this.onChainChanged.bind(this),this._onDisconnectBind=this.onDisconnect.bind(this)}async connect(t){try{const e=await this.getProvider(t);this.setupListeners(),this.emit("message",{type:"connecting"});const n=await e.request({method:"eth_requestAccounts"}),s=c.getAddress(n[0]),r=await this.getChainId();return{account:s,chain:{id:r,unsupported:this.isChainUnsupported(r)},provider:e}}catch(e){if(this._handleConnectReset(),this._isUserRejectedRequestError(e))throw new i.U(e);throw e}}async disconnect(){const t=await this.getProvider();await t.request({method:"wallet_disconnect"}),this.removeListeners(),this._handleConnectReset()}async getAccount(){const t=await this.getProvider(),e=await t.request({method:"eth_accounts"}),[n]=e||[];if(!n)throw new Error("No accounts found");return n}async getChainId(){const t=await this.getProvider(),e=await t.request({method:"eth_chainId"});return(0,g.n)(e)}getProvider(){let{chainId:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!this._provider){const e=t??this.chains[0]?.chainId??1,n=this.chains.find((t=>t.chainId===e))?.rpc[0];this._provider=new o.Z({ethereum:{chainId:e,rpc:n},appId:this.options.appId})?.ethereum}if(!this._provider)throw new i.a;return Promise.resolve(this._provider)}async getSigner(){let{chainId:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[e,n]=await Promise.all([this.getProvider(),this.getAccount()]);return new a.Q(e,t).getSigner(n)}async isAuthorized(){return!!this._provider?._blocto?.sessionKeyEnv??!1}async switchChain(t){const e=await this.getProvider(),n=h.hexValue(t),s=this.chains.find((e=>e.chainId===t));if(!s)throw new i.S(new Error("chain not found on connector."));if(!(await e.supportChainList())[`${t}`])throw new i.S(new Error(`Blocto unsupported chain: ${n}`));try{return await e.request({method:"wallet_addEthereumChain",params:[{chainId:n,rpcUrls:(0,u.g)(s)}]}),await e.request({method:"wallet_switchEthereumChain",params:[{chainId:n}]}),s}catch(r){if(this._isUserRejectedRequestError(r))throw new i.U(r);throw new i.S(r)}}onAccountsChanged(){}async onChainChanged(t){const e=(0,g.n)(t),n=this.isChainUnsupported(e),s=await this.getAccount();this.emit("change",{chain:{id:e,unsupported:n},account:s})}onDisconnect(){this.emit("disconnect")}async setupListeners(){const t=await this.getProvider();t.on("accountsChanged",this._onAccountsChangedBind),t.on("chainChanged",this._onChainChangedBind),t.on("disconnect",this._onDisconnectBind)}async removeListeners(){const t=await this.getProvider();t.off("accountsChanged",this._onAccountsChangedBind),t.off("chainChanged",this._onChainChangedBind),t.off("disconnect",this._onDisconnectBind)}_isUserRejectedRequestError(t){return/(user rejected)/i.test(t.message)}_handleConnectReset(){this._provider=void 0}}}}]);