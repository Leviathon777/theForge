"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7681],{7681:function(t,e,a){a.d(e,{D:function(){return g}});var r=a(61744),i=a(16441),s=a(2593),o=a(21046),n=a(9279),c=a(29251),l=a(64063),p=a.n(l),h=a(99612),d=a(93626),m=a(43277),u=a(21919),C=a(23437);class g{constructor(t,e,a){this.storage=a,this.contractWrapper=t,this.metadata=e}async getActive(t){const[e,a,r]=await Promise.all([this.get(),this.metadata.get(),this.getTokenDecimals()]);return await(0,d.y)(e,r,this.contractWrapper.getProvider(),a.merkle||{},this.storage,t?.withAllowList||!1)}async get(t){if(this.isLegacySinglePhaseDrop(this.contractWrapper)){const t=await this.contractWrapper.read("claimCondition",[]);return(0,d.z)(t)}if(this.isLegacyMultiPhaseDrop(this.contractWrapper)){const e=void 0!==t?t:await this.contractWrapper.read("getActiveClaimConditionId",[]),a=await this.contractWrapper.read("getClaimConditionById",[e]);return(0,d.z)(a)}if(this.isNewSinglePhaseDrop(this.contractWrapper)){const t=await this.contractWrapper.read("claimCondition",[]);return(0,d.A)(t)}if(this.isNewMultiphaseDrop(this.contractWrapper)){const e=void 0!==t?t:await this.contractWrapper.read("getActiveClaimConditionId",[]),a=await this.contractWrapper.read("getClaimConditionById",[e]);return(0,d.A)(a)}throw new Error("Contract does not support claim conditions")}async getAll(t){if(this.isLegacyMultiPhaseDrop(this.contractWrapper)||this.isNewMultiphaseDrop(this.contractWrapper)){const[e,a]=await this.contractWrapper.read("claimCondition",[]),r=e.toNumber(),i=a.toNumber(),s=[];for(let t=r;t<r+i;t++)s.push(this.get(t));const[o,n,...c]=await Promise.all([this.metadata.get(),this.getTokenDecimals(),...s]);return Promise.all(c.map((e=>(0,d.y)(e,n,this.contractWrapper.getProvider(),o.merkle,this.storage,t?.withAllowList||!1))))}return[await this.getActive(t)]}async canClaim(t,e){return e&&(e=await(0,h.aL)(e)),0===(await this.getClaimIneligibilityReasons(t,e)).length}async getClaimIneligibilityReasons(t,e){const n=[];let c,l;if(void 0===e)try{e=await this.contractWrapper.getSignerAddress()}catch(f){console.warn("failed to get signer address",f)}if(!e)return[d.C.NoWallet];const[p,u]=await Promise.all([(0,h.aL)(e),this.getTokenDecimals()]),C=r.parseUnits(h.cw.parse(t),u);try{l=await this.getActive()}catch(f){return(0,h.B)(f,"!CONDITION")||(0,h.B)(f,"no active mint condition")||(0,h.B)(f,"DropNoActiveCondition")?(n.push(d.C.NoClaimConditionSet),n):(console.warn("failed to get active claim condition",f),n.push(d.C.Unknown),n)}if("unlimited"!==l.availableSupply){if(r.parseUnits(l.availableSupply,u).lt(C))return n.push(d.C.NotEnoughSupply),n}const g=i.stripZeros(l.merkleRootHash).length>0;let w=null;if(g){if(w=await this.getClaimerProofs(p),!w&&(this.isLegacySinglePhaseDrop(this.contractWrapper)||this.isLegacyMultiPhaseDrop(this.contractWrapper)))return n.push(d.C.AddressNotAllowed),n;if(w)try{const e=await this.prepareClaim(t,!1,u,p);let a;if(this.isLegacyMultiPhaseDrop(this.contractWrapper)){if(c=await this.contractWrapper.read("getActiveClaimConditionId",[]),[a]=await this.contractWrapper.read("verifyClaimMerkleProof",[c,p,t,e.proofs,e.maxClaimable]),!a)return n.push(d.C.AddressNotAllowed),n}else if(this.isLegacySinglePhaseDrop(this.contractWrapper)){if([a]=await this.contractWrapper.read("verifyClaimMerkleProof",[p,t,{proof:e.proofs,maxQuantityInAllowlist:e.maxClaimable}]),!a)return n.push(d.C.AddressNotAllowed),n}else this.isNewSinglePhaseDrop(this.contractWrapper)?await this.contractWrapper.read("verifyClaim",[p,t,e.currencyAddress,e.price,{proof:e.proofs,quantityLimitPerWallet:e.maxClaimable,currency:e.currencyAddressInProof,pricePerToken:e.priceInProof}]):this.isNewMultiphaseDrop(this.contractWrapper)&&(c=await this.contractWrapper.read("getActiveClaimConditionId",[]),await this.contractWrapper.read("verifyClaim",[c,p,t,e.currencyAddress,e.price,{proof:e.proofs,quantityLimitPerWallet:e.maxClaimable,currency:e.currencyAddressInProof,pricePerToken:e.priceInProof}]))}catch(y){console.warn("Merkle proof verification failed:","reason"in y?y.reason||y.errorName:y);switch(y.reason||y.errorName){case"!Qty":case"DropClaimExceedLimit":n.push(d.C.OverMaxClaimablePerWallet);break;case"!PriceOrCurrency":case"DropClaimInvalidTokenPrice":n.push(d.C.WrongPriceOrCurrency);break;case"!MaxSupply":case"DropClaimExceedMaxSupply":n.push(d.C.NotEnoughSupply);break;case"cant claim yet":case"DropClaimNotStarted":n.push(d.C.ClaimPhaseNotStarted);break;default:n.push(d.C.AddressNotAllowed)}return n}}if(this.isNewSinglePhaseDrop(this.contractWrapper)||this.isNewMultiphaseDrop(this.contractWrapper)){let t=s.O$.from(0),e=(0,d.D)(l.maxClaimablePerWallet,u);try{t=await this.getSupplyClaimedByWallet(p)}catch(y){}if(w&&(e=(0,d.D)(w.maxClaimable,u)),e.gt(0)&&e.lt(t.add(C)))return n.push(d.C.OverMaxClaimablePerWallet),n;if((!g||g&&!w)&&(e.lte(t)||e.eq(0)))return n.push(d.C.AddressNotAllowed),n}if(this.isLegacySinglePhaseDrop(this.contractWrapper)||this.isLegacyMultiPhaseDrop(this.contractWrapper)){let[t,e]=[s.O$.from(0),s.O$.from(0)];this.isLegacyMultiPhaseDrop(this.contractWrapper)?(c=await this.contractWrapper.read("getActiveClaimConditionId",[]),[t,e]=await this.contractWrapper.read("getClaimTimestamp",[c,p])):this.isLegacySinglePhaseDrop(this.contractWrapper)&&([t,e]=await this.contractWrapper.read("getClaimTimestamp",[p]));const a=s.O$.from(Date.now()).div(1e3);if(t.gt(0)&&a.lt(e))return e.eq(o.Bz)?n.push(d.C.AlreadyClaimed):n.push(d.C.WaitBeforeNextClaimTransaction),n}if(l.price.gt(0)&&(0,h.d8)()){const e=l.price.mul(s.O$.from(t)),r=this.contractWrapper.getProvider();if((0,m.i)(l.currencyAddress)){(await r.getBalance(p)).lt(e)&&n.push(d.C.NotEnoughTokens)}else{const t=(await Promise.resolve().then(a.t.bind(a,30853,19))).default,i=new h.cs(r,l.currencyAddress,t,{},this.storage);(await i.read("balanceOf",[p])).lt(e)&&n.push(d.C.NotEnoughTokens)}}return n}async getClaimerProofs(t,e){const a=(await this.get(e)).merkleRoot;if(i.stripZeros(a).length>0){const[e,r]=await Promise.all([this.metadata.get(),(0,h.aL)(t)]);return await(0,d.f)(r,a.toString(),e.merkle,this.contractWrapper.getProvider(),this.storage,this.getSnapshotFormatVersion())}return null}async getSupplyClaimedByWallet(t){const e=await(0,h.aL)(t);if(this.isNewSinglePhaseDrop(this.contractWrapper))return await this.contractWrapper.read("getSupplyClaimedByWallet",[e]);if(this.isNewMultiphaseDrop(this.contractWrapper)){const t=await this.contractWrapper.read("getActiveClaimConditionId",[]);return await this.contractWrapper.read("getSupplyClaimedByWallet",[t,e])}throw new Error("This contract does not support the getSupplyClaimedByWallet function")}set=(0,C.f)((()=>{var t=this;return async function(e){let a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=e;if(t.isLegacySinglePhaseDrop(t.contractWrapper)||t.isNewSinglePhaseDrop(t.contractWrapper))if(a=!0,0===e.length)r=[{startTime:new Date(0),currencyAddress:n.d,price:0,maxClaimableSupply:0,maxClaimablePerWallet:0,waitInSeconds:0,merkleRootHash:i.hexZeroPad([0],32),snapshot:[]}];else if(e.length>1)throw new Error("Single phase drop contract cannot have multiple claim conditions, only one is allowed");(t.isNewSinglePhaseDrop(t.contractWrapper)||t.isNewMultiphaseDrop(t.contractWrapper))&&r.forEach((t=>{if(t.snapshot&&t.snapshot.length>0&&(void 0===t.maxClaimablePerWallet||"unlimited"===t.maxClaimablePerWallet))throw new Error("maxClaimablePerWallet must be set to a specific value when an allowlist is set.\nExample: Set it to 0 to only allow addresses in the allowlist to claim the amount specified in the allowlist.\ncontract.claimConditions.set([{ snapshot: [{ address: '0x...', maxClaimable: 1 }], maxClaimablePerWallet: 0 }])");if(t.snapshot&&t.snapshot.length>0&&"0"===t.maxClaimablePerWallet?.toString()&&0===t.snapshot.map((t=>"string"===typeof t?0:Number(t.maxClaimable?.toString()||0))).reduce(((t,e)=>t+e),0))throw new Error("maxClaimablePerWallet is set to 0, and all addresses in the allowlist have max claimable 0. This means that no one can claim.")}));const{snapshotInfos:s,sortedConditions:o}=await(0,d.H)(r,await t.getTokenDecimals(),t.contractWrapper.getProvider(),t.storage,t.getSnapshotFormatVersion()),c={};s.forEach((t=>{c[t.merkleRoot]=t.snapshotUri}));const l=await t.metadata.get(),h=[];if(!p()(l.merkle,c)){const e=await t.metadata.parseInputMetadata({...l,merkle:c}),a=await t.metadata._parseAndUploadMetadata(e);if(!(0,u.h)("setContractURI",t.contractWrapper))throw new Error("Setting a merkle root requires implementing ContractMetadata in your contract to support storing a merkle root.");{const e=new m.C(t.contractWrapper);h.push(e.encode("setContractURI",[a]))}}const g=t.contractWrapper,w=new m.C(g);if(t.isLegacySinglePhaseDrop(g)){const t=new m.C(g);h.push(t.encode("setClaimConditions",[(0,d.I)(o[0]),a]))}else if(t.isLegacyMultiPhaseDrop(g))h.push(w.encode("setClaimConditions",[o.map(d.I),a]));else if(t.isNewSinglePhaseDrop(g))h.push(w.encode("setClaimConditions",[(0,d.J)(o[0]),a]));else{if(!t.isNewMultiphaseDrop(g))throw new Error("Contract does not support claim conditions");h.push(w.encode("setClaimConditions",[o.map(d.J),a]))}if((0,u.h)("multicall",t.contractWrapper))return C.T.fromContractWrapper({contractWrapper:t.contractWrapper,method:"multicall",args:[h]});throw new Error("Contract does not support multicall")}})());update=(0,C.f)((async(t,e)=>{const a=await this.getAll(),r=await(0,d.K)(t,e,a);return await this.set.prepare(r)}));async getTokenDecimals(){return(0,u.d)(this.contractWrapper,"ERC20")?this.contractWrapper.read("decimals",[]):Promise.resolve(0)}async prepareClaim(t,e){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3?arguments[3]:void 0;const[i,s]=await Promise.all([r||this.contractWrapper.getSignerAddress(),this.getActive()]);return(0,d.E)(i,t,s,(async()=>(await this.metadata.get()).merkle),a,this.contractWrapper,this.storage,e,this.getSnapshotFormatVersion())}async getClaimArguments(t,e,a){const r=await(0,h.aL)(t);return this.isLegacyMultiPhaseDrop(this.contractWrapper)?[r,e,a.currencyAddress,a.price,a.proofs,a.maxClaimable]:this.isLegacySinglePhaseDrop(this.contractWrapper)?[r,e,a.currencyAddress,a.price,{proof:a.proofs,maxQuantityInAllowlist:a.maxClaimable},c.Y0("")]:[r,e,a.currencyAddress,a.price,{proof:a.proofs,quantityLimitPerWallet:a.maxClaimable,pricePerToken:a.priceInProof,currency:a.currencyAddressInProof},c.Y0("")]}async getClaimTransaction(t,e,a){if(a?.pricePerToken)throw new Error("Price per token is be set via claim conditions by calling `contract.erc721.claimConditions.set()`");const r=await this.prepareClaim(e,void 0===a?.checkERC20Allowance||a.checkERC20Allowance,await this.getTokenDecimals());return C.T.fromContractWrapper({contractWrapper:this.contractWrapper,method:"claim",args:await this.getClaimArguments(t,e,r),overrides:r.overrides})}isNewSinglePhaseDrop(t){return(0,u.d)(t,"ERC721ClaimConditionsV2")||(0,u.d)(t,"ERC20ClaimConditionsV2")}isNewMultiphaseDrop(t){return(0,u.d)(t,"ERC721ClaimPhasesV2")||(0,u.d)(t,"ERC20ClaimPhasesV2")}isLegacySinglePhaseDrop(t){return(0,u.d)(t,"ERC721ClaimConditionsV1")||(0,u.d)(t,"ERC20ClaimConditionsV1")}isLegacyMultiPhaseDrop(t){return(0,u.d)(t,"ERC721ClaimPhasesV1")||(0,u.d)(t,"ERC20ClaimPhasesV1")}getSnapshotFormatVersion(){return this.isLegacyMultiPhaseDrop(this.contractWrapper)||this.isLegacySinglePhaseDrop(this.contractWrapper)?d.F.V1:d.F.V2}}}}]);