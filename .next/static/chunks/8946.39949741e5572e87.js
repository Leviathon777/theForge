"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8946],{95068:function(t,r,e){e.d(r,{C:function(){return c}});var a=e(23437),n=e(99612);class c{featureName=n.du.name;constructor(t){this.contractWrapper=t}async get(){const[t,r]=await this.contractWrapper.read("getPlatformFeeInfo",[]);return n.bH.parseAsync({platform_fee_recipient:t,platform_fee_basis_points:r})}set=(0,a.f)((async t=>{const r=await n.bH.parseAsync(t);return a.T.fromContractWrapper({contractWrapper:this.contractWrapper,method:"setPlatformFeeInfo",args:[r.platform_fee_recipient,r.platform_fee_basis_points]})}))}},16921:function(t,r,e){e.d(r,{C:function(){return c}});var a=e(23437),n=e(99612);class c{featureName=n.d7.name;constructor(t){this.contractWrapper=t}async getRecipient(){return await this.contractWrapper.read("primarySaleRecipient",[])}setRecipient=(0,a.f)((async t=>a.T.fromContractWrapper({contractWrapper:this.contractWrapper,method:"setPrimarySaleRecipient",args:[t]})))}},18946:function(t,r,e){e.r(r),e.d(r,{EditionDrop:function(){return w}});var a=e(2593),n=e(9279),c=e(99612),s=e(23437),i=e(21919),o=e(43277),p=e(72555),h=e(88309),l=e(95068),d=e(82123),u=e(16921),f=e(9754),y=e(21694),g=e(42290);e(13550),e(77191),e(71770),e(64063);class m{constructor(t){this.events=t}async getAllClaimerAddresses(t){const r=(await this.events.getEvents("TokensClaimed")).filter((r=>!(!r.data||!a.O$.isBigNumber(r.data.tokenId))&&r.data.tokenId.eq(t)));return Array.from(new Set(r.filter((t=>"string"===typeof t.data?.claimer)).map((t=>t.data.claimer))))}}class w extends y.S{static contractRoles=c.dG;constructor(t,r,e){let a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},n=arguments.length>4?arguments[4]:void 0,s=arguments.length>5?arguments[5]:void 0;super(arguments.length>6&&void 0!==arguments[6]?arguments[6]:new c.cs(t,r,n,a,e),e,s),this.abi=c.bj.parse(n),this.metadata=new i.C(this.contractWrapper,c.bX,this.storage),this.app=new i.b(this.contractWrapper,this.metadata,this.storage),this.roles=new d.C(this.contractWrapper,w.contractRoles),this.royalties=new h.C(this.contractWrapper,this.metadata),this.sales=new u.C(this.contractWrapper),this.claimConditions=new f.D(this.contractWrapper,this.metadata,this.storage),this.events=new i.a(this.contractWrapper),this.history=new m(this.events),this.encoder=new o.C(this.contractWrapper),this.estimator=new i.G(this.contractWrapper),this.platformFees=new l.C(this.contractWrapper),this.interceptor=new p.C(this.contractWrapper),this.checkout=new g.P(this.contractWrapper),this.owner=new h.a(this.contractWrapper)}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.address}async getAll(t){return this.erc1155.getAll(t)}async getOwned(t,r){return this.erc1155.getOwned(t,r)}async getTotalCount(){return this.erc1155.totalCount()}async isTransferRestricted(){return!(await this.contractWrapper.read("hasRole",[(0,c.H)("transfer"),n.d]))}createBatch=(0,s.f)((async(t,r)=>this.erc1155.lazyMint.prepare(t,r)));async getClaimTransaction(t,r,e){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return this.erc1155.getClaimTransaction(t,r,e,{checkERC20Allowance:a})}claimTo=(0,s.f)((()=>{var t=this;return async function(r,e,a){let n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return t.erc1155.claimTo.prepare(r,e,a,{checkERC20Allowance:n})}})());claim=(0,s.f)((()=>{var t=this;return async function(r,e){let a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const n=await t.contractWrapper.getSignerAddress();return t.claimTo.prepare(n,r,e,a)}})());burnTokens=(0,s.f)((async(t,r)=>this.erc1155.burn.prepare(t,r)));async prepare(t,r,e){return s.T.fromContractWrapper({contractWrapper:this.contractWrapper,method:t,args:r,overrides:e})}async call(t,r,e){return this.contractWrapper.call(t,r,e)}}},21694:function(t,r,e){e.d(r,{S:function(){return c}});var a=e(23437),n=e(9754);class c{get chainId(){return this._chainId}constructor(t,r,e){this.contractWrapper=t,this.storage=r,this.erc1155=new n.E(this.contractWrapper,this.storage,e),this._chainId=e}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.address}async get(t){return this.erc1155.get(t)}async totalSupply(t){return this.erc1155.totalSupply(t)}async balanceOf(t,r){return this.erc1155.balanceOf(t,r)}async balance(t){return this.erc1155.balance(t)}async isApproved(t,r){return this.erc1155.isApproved(t,r)}transfer=(0,a.f)((()=>{var t=this;return async function(r,e,a){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[0];return t.erc1155.transfer.prepare(r,e,a,n)}})());transferBatch=(0,a.f)((()=>{var t=this;return async function(r,e,a,n){let c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:[0];return t.erc1155.transferBatch.prepare(r,e,a,n,c)}})());setApprovalForAll=(0,a.f)((async(t,r)=>this.erc1155.setApprovalForAll.prepare(t,r)));airdrop=(0,a.f)((()=>{var t=this;return async function(r,e,a){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[0];return t.erc1155.airdrop.prepare(r,e,a,n)}})())}},42290:function(t,r,e){e.d(r,{P:function(){return p}});var a=e(99612),n=e(38776);const c="https://paper.xyz/api/2022-08-12/platform/thirdweb",s={[a.aS.Mainnet]:"Ethereum",[a.aS.Goerli]:"Goerli",[a.aS.Polygon]:"Polygon",[a.aS.Mumbai]:"Mumbai",[a.aS.Avalanche]:"Avalanche"};async function i(t,r){const e=function(t){return(0,n.Z)(t in s,`chainId not supported by paper: ${t}`),s[t]}(r),a=await fetch(`${c}/register-contract?contractAddress=${t}&chain=${e}`),i=await a.json();return(0,n.Z)(i.result.id,"Contract is not registered with paper"),i.result.id}const o={expiresInMinutes:15,feeBearer:"BUYER",sendEmailOnSuccess:!0,redirectAfterPayment:!1};class p{constructor(t){this.contractWrapper=t}async getCheckoutId(){return i(this.contractWrapper.address,await this.contractWrapper.getChainID())}async isEnabled(){try{return!!(await this.getCheckoutId())}catch(t){return!1}}async createLinkIntent(t){return await async function(t,r){const e=await fetch(`${c}/checkout-link-intent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contractId:t,...o,...r,metadata:{...r.metadata,via_platform:"thirdweb"},hideNativeMint:!0,hidePaperWallet:!!r.walletAddress,hideExternalWallet:!0,hidePayWithCrypto:!0,usePaperKey:!1})}),a=await e.json();return(0,n.Z)(a.checkoutLinkIntentUrl,"Failed to create checkout link intent"),a.checkoutLinkIntentUrl}(await this.getCheckoutId(),t)}}}}]);