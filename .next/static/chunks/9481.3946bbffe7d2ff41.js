"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9481],{69977:function(t,n,i){function s(t){return"string"===typeof t?Number.parseInt(t,"0x"===t.trim().substring(0,2)?16:10):"bigint"===typeof t?Number(t):t}i.d(n,{n:function(){return s}})},89481:function(t,n,i){i.r(n),i.d(n,{LocalWalletConnector:function(){return g}});var s=i(37139),e=i(69977),r=i(38569),a=i(23437),o=i(99612),c=i(48088),h=i(56371);i(68457);class d extends c.Signer{constructor(t){super(),this.signer=t,(0,h.defineReadOnly)(this,"provider",t.provider)}async getAddress(){return await this.signer.getAddress()}async signMessage(t){return await this.signer.signMessage(t)}async signTransaction(t){return await this.signer.signTransaction(t)}connect(t){return new d(this.signer.connect(t))}_signTypedData(t,n,i){return this.signer._signTypedData(t,n,i)}async sendTransaction(t){if(!this.provider)throw new Error("Provider not found");const n={...await(0,a.g)(this.provider),...t};return await this.signer.sendTransaction(n)}}class g extends r.C{constructor(t){super(),(0,s._)(this,"id","local_wallet"),(0,s._)(this,"name","Local Wallet"),(0,s._)(this,"shimDisconnectKey","localWallet.shimDisconnect"),(0,s._)(this,"onChainChanged",(t=>{const n=(0,e.n)(t),i=!this.options.chains.find((t=>t.chainId===n));this.emit("change",{chain:{id:n,unsupported:i}})})),this.options=t}async connect(t){t.chainId&&this.switchChain(t.chainId);const n=await this.getSigner();return await n.getAddress()}async disconnect(){this._provider=void 0,this._signer=void 0}async getAddress(){const t=await this.getSigner();if(!t)throw new Error("No signer found");return await t.getAddress()}async isConnected(){try{return!!(await this.getAddress())}catch{return!1}}async getProvider(){return this._provider||(this._provider=(0,o.a_)(this.options.chain,{clientId:this.options.clientId,secretKey:this.options.secretKey})),this._provider}async getSigner(){if(!this._signer){const t=await this.getProvider();this._signer=u(this.options.ethersWallet,t)}return this._signer}async switchChain(t){const n=this.options.chains.find((n=>n.chainId===t));if(!n)throw new Error(`Chain not found for chainId ${t}, please add it to the chains property when creating this wallet`);this._provider=(0,o.a_)(n,{clientId:this.options.clientId,secretKey:this.options.secretKey}),this._signer=u(this.options.ethersWallet,this._provider),this.onChainChanged(t)}async setupListeners(){}updateChains(t){this.options.chains=t}}function u(t,n){let i=t;return n&&(i=t.connect(n)),new d(i)}}}]);