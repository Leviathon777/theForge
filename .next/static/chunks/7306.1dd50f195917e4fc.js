"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7306],{30150:function(t,e,a){a.d(e,{D:function(){return w},H:function(){return m},g:function(){return g},h:function(){return u},r:function(){return p}});var i=a(6881),r=a(16441),s=a(38197),n=a(84243),o=a(2593),c=a(93901),d=a(17570),h=a(65673),l=a(54593);async function u(t){const e=await i.resolveProperties(t);return Object.keys(e).map((t=>{let a=e[t];return"string"===typeof a&&a.startsWith("0x")||(a=r.hexValue(a)),[t,a]})).reduce(((t,e)=>{let[a,i]=e;return{...t,[a]:i}}),{})}async function g(t,e,a){const r=await i.resolveProperties(t),o={sender:r.sender,nonce:r.nonce,initCodeHash:s.keccak256(r.initCode),callDataHash:s.keccak256(r.callData),callGasLimit:r.callGasLimit,verificationGasLimit:r.verificationGasLimit,preVerificationGas:r.preVerificationGas,maxFeePerGas:r.maxFeePerGas,maxPriorityFeePerGas:r.maxPriorityFeePerGas,paymasterAndDataHash:s.keccak256(r.paymasterAndData)},c=n.$.encode([{components:[{type:"address",name:"sender"},{type:"uint256",name:"nonce"},{type:"bytes32",name:"initCodeHash"},{type:"bytes32",name:"callDataHash"},{type:"uint256",name:"callGasLimit"},{type:"uint256",name:"verificationGasLimit"},{type:"uint256",name:"preVerificationGas"},{type:"uint256",name:"maxFeePerGas"},{type:"uint256",name:"maxPriorityFeePerGas"},{type:"bytes32",name:"paymasterAndDataHash"}],name:"hashedUserOp",type:"tuple"}],[{...o}]),d=s.keccak256(c),h=n.$.encode(["bytes32","address","uint256"],[d,e,a]);return s.keccak256(h)}const p=()=>{let t=(()=>{const t=BigInt(Math.floor(4294967296*Math.random())),e=BigInt(Math.floor(4294967296*Math.random())),a=BigInt(Math.floor(4294967296*Math.random())),i=BigInt(Math.floor(4294967296*Math.random())),r=BigInt(Math.floor(4294967296*Math.random())),s=BigInt(Math.floor(4294967296*Math.random()));return t<<BigInt(160)|e<<BigInt(128)|a<<BigInt(96)|i<<BigInt(64)|r<<BigInt(32)|s})().toString(16);return t.length%2!==0&&(t="0"+t),t="0x"+t,o.O$.from(r.concat([t,"0x0000000000000000"]))},w=!1;class m{constructor(t,e,a,i,r){this.bundlerUrl=t,this.entryPointAddress=e,this.chainId=a;const s={};if((0,d.i)(this.bundlerUrl)){const t="undefined"!==typeof globalThis&&"APP_BUNDLE_ID"in globalThis?globalThis.APP_BUNDLE_ID:void 0;r?s["x-secret-key"]=r:i&&(s["x-client-id"]=i,t&&(s["x-bundle-id"]=t)),"undefined"!==typeof globalThis&&"TW_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_AUTH_TOKEN&&(s.authorization=`Bearer ${globalThis.TW_AUTH_TOKEN}`),"undefined"!==typeof globalThis&&"TW_CLI_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_CLI_AUTH_TOKEN&&(s.authorization=`Bearer ${globalThis.TW_CLI_AUTH_TOKEN}`,s["x-authorize-wallet"]="true"),(0,h.s)(s)}this.userOpJsonRpcProvider=new c.c({url:this.bundlerUrl,headers:s},{name:"Connected bundler network",chainId:a}),this.initializing=this.validateChainId()}async validateChainId(){if(await(0,l.e)(this.chainId))return;const t=await this.userOpJsonRpcProvider.send("eth_chainId",[]),e=parseInt(t);if(e!==this.chainId)throw new Error(`bundler ${this.bundlerUrl} is on chainId ${e}, but provider is on chainId ${this.chainId}`)}async sendUserOpToBundler(t){await this.initializing;const e=await u(t),a=[e,this.entryPointAddress];return await this.printUserOperation("eth_sendUserOperation",a),await this.userOpJsonRpcProvider.send("eth_sendUserOperation",[e,this.entryPointAddress])}async estimateUserOpGas(t){await this.initializing;const e=await u(t),a=[e,this.entryPointAddress];await this.printUserOperation("eth_estimateUserOperationGas",a);const i=await this.userOpJsonRpcProvider.send("eth_estimateUserOperationGas",[e,this.entryPointAddress]);return{preVerificationGas:o.O$.from(i.preVerificationGas),verificationGas:o.O$.from(i.verificationGas),verificationGasLimit:o.O$.from(i.verificationGasLimit),callGasLimit:o.O$.from(i.callGasLimit).add(l.M)}}async getUserOperationGasPrice(){return await this.initializing,await this.userOpJsonRpcProvider.send("thirdweb_getUserOperationGasPrice",[])}async getUserOperationReceipt(t){return await this.initializing,await this.userOpJsonRpcProvider.send("eth_getUserOperationReceipt",[t])}async zkPaymasterData(t){return await this.initializing,await this.userOpJsonRpcProvider.send("zk_paymasterData",[await u({...t,gas:t.gasLimit})])}async zkBroadcastTransaction(t){return await this.initializing,await this.userOpJsonRpcProvider.send("zk_broadcastTransaction",[t])}async printUserOperation(t,e){}}},27306:function(t,e,a){a.r(e),a.d(e,{SmartWalletConnector:function(){return F}});var i=a(89993),r=a(30150),s=a(17570),n=a(65673),o=a(51364),c=a(84243),d=a(48088),h=a(6881),l=a(93684),u=a(93901),g=a(64146),p=a(97013),w=a(2593),m=a(16441),f=a(9279),y=a(79911),A=a(19485),P=a(29251),v=a(61744),T=a(28027),I=a(99612),O=a(23437),b=a(13904),x=a(62587),G=a(54593),C=a(22555);a(14848);class U extends class{}{constructor(t,e,a,i){super(),this.paymasterUrl=t,this.entryPoint=e,this.clientId=a,this.secretKey=i}async getPaymasterAndData(t){const e={"Content-Type":"application/json"};if((0,s.i)(this.paymasterUrl)){if(this.secretKey&&this.clientId)throw new Error("Cannot use both secret key and client ID. Please use secretKey for server-side applications and clientId for client-side applications.");if(this.secretKey)e["x-secret-key"]=this.secretKey;else if(this.clientId){e["x-client-id"]=this.clientId;const t="undefined"!==typeof globalThis&&"APP_BUNDLE_ID"in globalThis?globalThis.APP_BUNDLE_ID:void 0;t&&(e["x-bundle-id"]=t)}"undefined"!==typeof globalThis&&"TW_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_AUTH_TOKEN&&(e.authorization=`Bearer ${globalThis.TW_AUTH_TOKEN}`),"undefined"!==typeof globalThis&&"TW_CLI_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_CLI_AUTH_TOKEN&&(e.authorization=`Bearer ${globalThis.TW_CLI_AUTH_TOKEN}`,e["x-authorize-wallet"]="true"),(0,n.s)(e)}const a=await fetch(this.paymasterUrl,{method:"POST",headers:e,body:JSON.stringify({jsonrpc:"2.0",id:1,method:"pm_sponsorUserOperation",params:[await(0,r.h)(t),this.entryPoint]})}),i=await a.json();if(!a.ok){const t=i.error||a.statusText,e=i.code||"UNKNOWN";throw new Error(`Paymaster error: ${t}\nStatus: ${a.status}\nCode: ${e}`)}if(r.D&&console.debug("Paymaster result:",i),i.result)return"string"===typeof i.result?{paymasterAndData:i.result}:i.result;{const t=i.error?.message||i.error||a.statusText||"unknown error";throw new Error(`Paymaster error from ${this.paymasterUrl}: ${t}`)}}}const _=(t,e,a,i)=>new U(t,e,a,i);class E{constructor(t,e,a,i,r,s,n){this.resolve=t,this.reject=e,this.entryPoint=a,this.sender=i,this.userOpHash=r,this.nonce=s,this.timeout=n,(0,T._)(this,"resolved",!1),this.boundLisener=this.listenerCallback.bind(this)}start(){const t=this.entryPoint.filters.UserOperationEvent(this.userOpHash);setTimeout((async()=>{const e=await this.entryPoint.queryFilter(t,-10);e.length>0?this.listenerCallback(e[0]):this.entryPoint.once(t,this.boundLisener)}),100)}stop(){this.entryPoint.off("UserOperationEvent",this.boundLisener)}async listenerCallback(){for(var t=arguments.length,e=new Array(t),a=0;a<t;a++)e[a]=arguments[a];const i=arguments[arguments.length-1];if(!i.args)return void console.error("got event without args",i);if(i.args.userOpHash!==this.userOpHash)return void console.log(`== event with wrong userOpHash: sender/nonce: event.${i.args.sender}@${i.args.nonce.toString()}!= userOp.${this.sender}@${parseInt(this.nonce?.toString())}`);const r=await i.getTransactionReceipt();i.args.success||await this.extractFailureReason(r),this.stop(),this.resolve(r),this.resolved=!0}async extractFailureReason(t){t.status=0;const e=await this.entryPoint.queryFilter(this.entryPoint.filters.UserOperationRevertReason(this.userOpHash,this.sender),t.blockHash);if(e[0]){let t=e[0].args.revertReason;t.startsWith("0x08c379a0")&&(t=c.$.decode(["string"],"0x"+t.substring(10)).toString()),this.reject(new Error(`UserOp failed with reason: ${t}`))}}}class L extends d.Signer{constructor(t,e,a,i,r){super(),h.defineReadOnly(this,"provider",a),this.config=t,this.originalSigner=e,this.erc4337provider=a,this.httpRpcClient=i,this.smartAccountAPI=r,this.approving=!1}async sendTransaction(t,e){if(!this.approving){this.approving=!0;const t=await this.smartAccountAPI.createApproveTx();t&&await(await this.sendTransaction(t)).wait(),this.approving=!1}const a=await h.resolveProperties(t);await this.verifyAllNecessaryFields(a);const i=(0,r.r)(),s=await this.smartAccountAPI.createUnsignedUserOp(this.httpRpcClient,{target:a.to||"",data:a.data?.toString()||"0x",value:a.value,gasLimit:a.gasLimit,nonce:i,maxFeePerGas:a.maxFeePerGas,maxPriorityFeePerGas:a.maxPriorityFeePerGas},e),n=await this.smartAccountAPI.signUserOp(s),o=await this.erc4337provider.constructUserOpTransactionResponse(n);try{await this.httpRpcClient.sendUserOpToBundler(n)}catch(c){throw this.unwrapError(c)}return o}unwrapError(t){try{let e="Unknown Error";if(t.error)e=`The bundler has failed to include UserOperation in a batch: ${t.error}`;else if(t.body&&"string"===typeof t.body){const a=JSON.parse(t.body),i=t.status||"UNKNOWN",r=a?.code||"UNKNOWN";let s=a?.error?.message||a?.error?.data||a?.error||t.reason;if(s?.includes("FailedOp")){let t="";const a=s.match(/FailedOp\((.*)\)/);if(a){const e=a[1].split(",");t=`(paymaster address: ${e[1]})`,s=e[2]}e=`The bundler has failed to include UserOperation in a batch: ${s} ${t}`}else e=`RPC error: ${s}\nStatus: ${i}\nCode: ${r}`}const a=new Error(e);return a.stack=t.stack,a}catch(e){}return t}async verifyAllNecessaryFields(t){if(!t.to)throw new Error("Missing call target");if(!t.data&&!t.value)throw new Error("Missing call data or value")}connect(t){throw new Error("changing providers is not supported")}async getAddress(){return this.address||(this.address=await this.erc4337provider.getSenderAccountAddress()),this.address}async signMessage(t){if(await this.smartAccountAPI.checkAccountPhantom()){console.log("Account contract not deployed yet. Deploying account before signing message");const t=await this.sendTransaction({to:await this.getAddress(),data:"0x"});await t.wait()}const[e,a]=await Promise.all([this.getChainId(),this.getAddress()]),i=l.r(t);let r,o;const d=(0,x.m)(e,this.config.clientId),h={};if((0,s.i)(d)){const t="undefined"!==typeof globalThis&&"APP_BUNDLE_ID"in globalThis?globalThis.APP_BUNDLE_ID:void 0;this.config.secretKey?h["x-secret-key"]=this.config.secretKey:this.config.clientId&&(h["x-client-id"]=this.config.clientId,t&&(h["x-bundle-id"]=t)),"undefined"!==typeof globalThis&&"TW_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_AUTH_TOKEN&&(h.authorization=`Bearer ${globalThis.TW_AUTH_TOKEN}`),"undefined"!==typeof globalThis&&"TW_CLI_AUTH_TOKEN"in globalThis&&"string"===typeof globalThis.TW_CLI_AUTH_TOKEN&&(h.authorization=`Bearer ${globalThis.TW_CLI_AUTH_TOKEN}`,h["x-authorize-wallet"]="true"),(0,n.s)(h)}try{const t=new u.c({url:d,headers:h},e),s=new g.CH(a,["function getMessageHash(bytes32 _hash) public view returns (bytes32)"],t);await s.getMessageHash(i),r=!0}catch{r=!1}if(r){o=(await(0,I.aM)(this,{name:"Account",version:"1",chainId:e,verifyingContract:a},{AccountMessage:[{name:"message",type:"bytes"}]},{message:c.$.encode(["bytes32"],[i])})).signature}else o=await this.originalSigner.signMessage(t);if(await(0,G.c)(t,o,a,e,this.config.clientId,this.config.secretKey))return o;throw new Error("Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.")}async signTransaction(t,e){const a=await h.resolveProperties(t);await this.verifyAllNecessaryFields(a);const i=(0,r.r)(),s=await this.smartAccountAPI.createUnsignedUserOp(this.httpRpcClient,{target:a.to||"",data:a.data?.toString()||"0x",value:a.value,gasLimit:a.gasLimit,nonce:i},e),n=await this.smartAccountAPI.signUserOp(s);return JSON.stringify(await(0,r.h)(n))}}class k extends p.Zk{constructor(t,e,a,i,r,s,n){super({name:"ERC-4337 Custom Network",chainId:t}),this.chainId=t,this.config=e,this.originalSigner=a,this.originalProvider=i,this.httpRpcClient=r,this.entryPoint=s,this.smartAccountAPI=n,this.signer=new L(e,a,this,r,n)}getSigner(){return this.signer}async perform(t,e){if("sendTransaction"===t||"getTransactionReceipt"===t)throw new Error("Should not get here. Investigate.");return"estimateGas"===t?w.O$.from(5e5):await this.originalProvider.perform(t,e)}async getTransaction(t){return await super.getTransaction(t)}async getTransactionReceipt(t){const e=await t,a=await this.getSenderAccountAddress();return await new Promise(((t,i)=>{new E(t,i,this.entryPoint,a,e).start()}))}async getSenderAccountAddress(){return await this.smartAccountAPI.getAccountAddress()}async waitForTransaction(t,e,a){const i=await this.getSenderAccountAddress();return await new Promise(((e,r)=>{new E(e,r,this.entryPoint,i,t,void 0,a).start()}))}async constructUserOpTransactionResponse(t){const e=await h.resolveProperties(t),a=await this.smartAccountAPI.getUserOpHash(e);return{hash:a,confirmations:0,from:e.sender,nonce:0,gasLimit:w.O$.from(e.callGasLimit),value:w.O$.from(0),data:m.hexValue(e.callData),chainId:this.chainId,wait:async t=>{const i=await this.smartAccountAPI.getUserOpReceipt(this.httpRpcClient,a);return 0!==e.initCode.length&&await this.smartAccountAPI.checkAccountPhantom(),i}}}async detectNetwork(){return this.originalProvider.detectNetwork()}}class D extends class{constructor(t){(0,T._)(this,"isPhantom",!0),this.provider=t.provider,this.entryPointAddress=t.entryPointAddress,this.accountAddress=t.accountAddress,this.paymasterAPI=t.paymasterAPI,this.gasless=t.gasless,this.erc20PaymasterAddress=t.erc20PaymasterAddress,this.erc20TokenAddress=t.erc20TokenAddress,this.entryPointView=o.EntryPoint__factory.connect(t.entryPointAddress,t.provider).connect(f.d)}async checkAccountPhantom(){if(!this.isPhantom)return this.isPhantom;return(await this.provider.getCode(this.getAccountAddress())).length>2&&(this.isPhantom=!1),this.isPhantom}async getInitCode(){return await this.checkAccountPhantom()?await this.getAccountInitCode():"0x"}async getVerificationGasLimit(){return 1e5}async getUserOpHash(t){const e=await this.provider.getNetwork().then((t=>t.chainId));return(0,r.g)(t,this.entryPointAddress,e)}async getAccountAddress(){return this.senderAddress||(this.accountAddress?this.senderAddress=this.accountAddress:this.senderAddress=await this.getCounterFactualAddress()),this.senderAddress}async estimateCreationGas(t){if(!t||"0x"===t)return 0;const e=t.substring(0,42),a="0x"+t.substring(42);return await this.provider.estimateGas({to:e,data:a})}async createUnsignedUserOp(t,e,a){let{maxFeePerGas:i,maxPriorityFeePerGas:r}=e;if((0,s.i)(t.bundlerUrl)){const e=await t.getUserOperationGasPrice();i=w.O$.from(e.maxFeePerGas),r=w.O$.from(e.maxPriorityFeePerGas)}else if(!i||!r){const t=await(0,O.a)(this.provider);if(r||(r=t.maxPriorityFeePerGas??void 0),!i){i=t.maxFeePerGas??void 0;const e=(await this.provider.getNetwork()).chainId;e!==C.Lll.chainId&&e!==C.M8s.chainId&&e!==C.m3x.chainId||(r=i)}}if(!i||!r)throw new Error("maxFeePerGas or maxPriorityFeePerGas could not be calculated, please pass them explicitely");const[n,o]=await Promise.all([this.getAccountAddress(),e.nonce?Promise.resolve(e.nonce):this.getNonce()]),c=await this.getInitCode(),d=function(t){if(!t||""===t)return null;return w.O$.from(t.toString())}(e.value)??w.O$.from(0),h=a?.batchData?e.data:await this.prepareExecute(e.target,d,e.data).then((async t=>(e.gasLimit||await this.provider.estimateGas({from:n,to:e.target,data:e.data,value:d}),t.encode()))),l={sender:n,nonce:o,initCode:c,callData:h,maxFeePerGas:i,maxPriorityFeePerGas:r,callGasLimit:w.O$.from(1e6),verificationGasLimit:w.O$.from(1e6),preVerificationGas:w.O$.from(1e6),paymasterAndData:"0x",signature:"0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"},u=void 0!==a?.gasless?a.gasless:this.gasless;if(this.erc20PaymasterAddress&&this.erc20TokenAddress&&await this.isAccountApproved()){let e;l.paymasterAndData=this.erc20PaymasterAddress;try{e=await t.estimateUserOpGas(l)}catch(g){throw this.unwrapBundlerError(g)}l.callGasLimit=e.callGasLimit,l.verificationGasLimit=e.verificationGasLimit,l.preVerificationGas=e.preVerificationGas}else if(u){const e=await this.paymasterAPI.getPaymasterAndData(l),a=e.paymasterAndData;if(a&&"0x"!==a&&(l.paymasterAndData=a),e.callGasLimit&&e.verificationGasLimit&&e.preVerificationGas)l.callGasLimit=w.O$.from(e.callGasLimit),l.verificationGasLimit=w.O$.from(e.verificationGasLimit),l.preVerificationGas=w.O$.from(e.preVerificationGas);else{let e;try{e=await t.estimateUserOpGas(l)}catch(g){throw this.unwrapBundlerError(g)}if(l.callGasLimit=e.callGasLimit,l.verificationGasLimit=e.verificationGasLimit,l.preVerificationGas=e.preVerificationGas,a&&"0x"!==a){const t=await this.paymasterAPI.getPaymasterAndData(l);t.paymasterAndData&&"0x"!==t.paymasterAndData&&(l.paymasterAndData=t.paymasterAndData)}}}else{let e;try{e=await t.estimateUserOpGas(l)}catch(g){throw this.unwrapBundlerError(g)}l.callGasLimit=e.callGasLimit,l.verificationGasLimit=e.verificationGasLimit,l.preVerificationGas=e.preVerificationGas}return{...l,signature:""}}async signUserOp(t){const e=await this.getUserOpHash(t),a=await this.signUserOpHash(e);return{...t,signature:a}}async getUserOpReceipt(t,e){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:12e4,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1e3;const r=Date.now()+a;for(;Date.now()<r;){const a=await t.getUserOperationReceipt(e);if(a)return await this.provider.waitForTransaction(a.receipt.transactionHash);await new Promise((t=>setTimeout(t,i)))}throw new Error("Timeout waiting for userOp to be mined")}unwrapBundlerError(t){const e=t?.error?.message||t.error||t.message||t;return new Error(e)}}{constructor(t,e){super({...t,provider:e}),this.params=t,this.sdk=b.T.fromPrivateKey(b.L,t.chain,{clientId:t.clientId,secretKey:t.secretKey,supportedChains:"object"===typeof t.chain?[t.chain]:void 0})}async getChainId(){return await this.provider.getNetwork().then((t=>t.chainId))}async getAccountContract(){return this.accountContract||(this.params.accountInfo?.abi?this.accountContract=await this.sdk.getContract(await this.getAccountAddress(),this.params.accountInfo.abi):this.accountContract=await this.sdk.getContract(await this.getAccountAddress(),G.A)),this.accountContract}async getAccountInitCode(){const t=await this.getFactoryContract(),e=await this.params.localSigner.getAddress(),a=await this.params.factoryInfo.createAccount(t,e);return m.hexConcat([t.getAddress(),a.encode()])}async getFactoryContract(){return this.factoryContract||(this.params.factoryInfo?.abi?this.factoryContract=await this.sdk.getContract(this.params.factoryAddress,this.params.factoryInfo.abi):this.factoryContract=await this.sdk.getContract(this.params.factoryAddress)),this.factoryContract}async getCounterFactualAddress(){if(this.params.accountAddress)return this.params.accountAddress;const t=await this.getFactoryContract(),e=await this.params.localSigner.getAddress();return this.params.factoryInfo.getAccountAddress(t,e)}async getNonce(){if(await this.checkAccountPhantom())return w.O$.from(0);const t=await this.getAccountContract();return this.params.accountInfo.getNonce(t)}async prepareExecute(t,e,a){const i=await this.getAccountContract();return this.params.accountInfo.execute(i,t,e,a)}async prepareExecuteBatch(t,e,a){return(await this.getAccountContract()).prepare("executeBatch",[t,e,a])}async signUserOpHash(t){return await this.params.localSigner.signMessage(m.arrayify(t))}async isAcountDeployed(){return!(await this.checkAccountPhantom())}async isAccountApproved(){if(!this.params.erc20PaymasterAddress||!this.params.erc20TokenAddress)return!0;const t=await this.getCounterFactualAddress(),e=(await a.e(758).then(a.t.bind(a,50758,19))).default,i=await this.sdk.getContract(this.params.erc20TokenAddress,e);return(await i.call("allowance",[t,this.params.erc20PaymasterAddress])).gte(w.O$.from(2).pow(96).sub(1))}async createApproveTx(){if(await this.isAccountApproved())return;const t=w.O$.from(2).pow(96).sub(1),e=new y.Wallet(b.L,this.provider),a=new g.CH(this.params.erc20TokenAddress,["function approve(address spender, uint256 amount) public returns (bool)"],e);return{to:this.params.erc20TokenAddress,from:await this.getAccountAddress(),value:0,data:a.interface.encodeFunctionData("approve",[this.params.erc20PaymasterAddress,t])}}}class F extends i.C{constructor(t){super(),this.config=t}async initialize(t){const e=this.config,a=(0,I.a_)(e.chain,{clientId:e.clientId,secretKey:e.secretKey});this.chainId=(await a.getNetwork()).chainId;const i=this.config.bundlerUrl||`https://${this.chainId}.bundler.thirdweb.com`,s=this.config.paymasterUrl||`https://${this.chainId}.bundler.thirdweb.com`,n=e.entryPointAddress||G.f,c=await t.personalWallet.getSigner(),d={chain:e.chain,localSigner:c,entryPointAddress:n,bundlerUrl:i,paymasterAPI:this.config.paymasterAPI?this.config.paymasterAPI:_(s,n,this.config.clientId,this.config.secretKey),gasless:e.gasless,factoryAddress:e.factoryAddress||G.D,accountAddress:t.accountAddress,factoryInfo:{createAccount:e.factoryInfo?.createAccount||this.defaultFactoryInfo().createAccount,getAccountAddress:e.factoryInfo?.getAccountAddress||this.defaultFactoryInfo().getAccountAddress,abi:e.factoryInfo?.abi},accountInfo:{execute:e.accountInfo?.execute||this.defaultAccountInfo().execute,getNonce:e.accountInfo?.getNonce||this.defaultAccountInfo().getNonce,abi:e.accountInfo?.abi},clientId:e.clientId,secretKey:e.secretKey,erc20PaymasterAddress:e.erc20PaymasterAddress,erc20TokenAddress:e.erc20TokenAddress};this.personalWallet=t.personalWallet;const h=new D(d,a);this.aaProvider=function(t,e,a,i){const s=o.EntryPoint__factory.connect(t.entryPointAddress,a),n=new r.H(t.bundlerUrl,t.entryPointAddress,i,t.clientId,t.secretKey);return new k(i,t,t.localSigner,a,n,s,e)}(d,h,a,this.chainId),this.accountApi=h}async connect(t){return await this.initialize(t),await this.getAddress()}getProvider(){if(!this.aaProvider)throw new Error("Personal wallet not connected");return Promise.resolve(this.aaProvider)}async getSigner(){if(!this.aaProvider)throw new Error("Personal wallet not connected");return Promise.resolve(this.aaProvider.getSigner())}async getAddress(){return(await this.getSigner()).getAddress()}async isConnected(){try{return!!(await this.getAddress())}catch(t){return!1}}async disconnect(){this.personalWallet=void 0,this.aaProvider=void 0}async switchChain(t){const e=await this.getProvider();if((await e.getNetwork()).chainId!==t)throw new Error("Not supported.")}setupListeners(){return Promise.resolve()}updateChains(t){}async hasPermissionToExecute(t){const e=await this.getAccountContract(),a=await this.getSigner(),i=await a.getAddress(),r=(await e.account.getAllSigners()).filter((t=>A.getAddress(t.signer)===A.getAddress(i)))[0]?.permissions;return!!r&&r.approvedCallTargets.includes(t.getTarget())}async send(t,e){return(await this.getSigner()).sendTransaction({to:t.getTarget(),data:t.encode(),value:await t.getValue()},e)}async execute(t,e){const a=await this.send(t,e);return{receipt:await a.wait()}}async sendBatch(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");const a=await this.getSigner(),{tx:i,batchData:r}=await this.prepareBatchTx(t);return await a.sendTransaction({to:await a.getAddress(),data:i.encode(),value:0},{...e,batchData:r})}async executeBatch(t,e){const a=await this.sendBatch(t,e);return{receipt:await a.wait()}}async sendRaw(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");return(await this.getSigner()).sendTransaction(t,e)}async executeRaw(t,e){const a=await this.sendRaw(t,e);return{receipt:await a.wait()}}async sendBatchRaw(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");const a=await this.getSigner(),i=await this.prepareBatchRaw(t);return a.sendTransaction({to:await a.getAddress(),data:i.tx.encode(),value:0},{...e,batchData:i.batchData})}async executeBatchRaw(t,e){const a=await this.sendBatchRaw(t,e);return{receipt:await a.wait()}}async estimate(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");return this.estimateTx({target:t.getTarget(),data:t.encode(),value:await t.getValue(),gasLimit:await t.getOverrides().gasLimit,maxFeePerGas:await t.getOverrides().maxFeePerGas,maxPriorityFeePerGas:await t.getOverrides().maxPriorityFeePerGas,nonce:await t.getOverrides().nonce},e)}async estimateRaw(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");const a=await h.resolveProperties(t);return this.estimateTx({target:a.to||f.d,data:a.data?.toString()||"",value:a.value||w.O$.from(0),gasLimit:a.gasLimit,maxFeePerGas:a.maxFeePerGas,maxPriorityFeePerGas:a.maxPriorityFeePerGas,nonce:a.nonce},e)}async estimateBatch(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");const{tx:a,batchData:i}=await this.prepareBatchTx(t);return this.estimateTx({target:a.getTarget(),data:a.encode(),value:await a.getValue(),gasLimit:await a.getOverrides().gasLimit,maxFeePerGas:await a.getOverrides().maxFeePerGas,maxPriorityFeePerGas:await a.getOverrides().maxPriorityFeePerGas,nonce:await a.getOverrides().nonce},{...e,batchData:i})}async estimateBatchRaw(t,e){if(!this.accountApi)throw new Error("Personal wallet not connected");const{tx:a,batchData:i}=await this.prepareBatchRaw(t);return this.estimateTx({target:a.getTarget(),data:a.encode(),value:await a.getValue(),gasLimit:await a.getOverrides().gasLimit,maxFeePerGas:await a.getOverrides().maxFeePerGas,maxPriorityFeePerGas:await a.getOverrides().maxPriorityFeePerGas,nonce:await a.getOverrides().nonce},{...e,batchData:i})}async deploy(t){if(!this.accountApi)throw new Error("Personal wallet not connected");const e=await this.getSigner(),a=await e.sendTransaction({to:await e.getAddress(),data:"0x"},{...t,batchData:{targets:[],data:[],values:[]}});return{receipt:await a.wait()}}async isDeployed(){if(!this.accountApi)throw new Error("Personal wallet not connected");return await this.accountApi.isAcountDeployed()}async deployIfNeeded(t){await this.isDeployed()||await this.deploy(t)}async grantPermissions(t,e){return(await this.getAccountContract()).account.grantPermissions(t,e)}async revokePermissions(t){return(await this.getAccountContract()).account.revokeAccess(t)}async addAdmin(t){return(await this.getAccountContract()).account.grantAdminPermissions(t)}async removeAdmin(t){return(await this.getAccountContract()).account.revokeAdminPermissions(t)}async getAllActiveSigners(){if(await this.isDeployed()){return(await this.getAccountContract()).account.getAllAdminsAndSigners()}{const t=await(this.personalWallet?.getSigner());if(!t)throw new Error("Personal wallet not connected");return[{isAdmin:!0,signer:await t.getAddress(),permissions:{startDate:new Date(0),expirationDate:new Date(0),nativeTokenLimitPerTransaction:w.O$.from(0),approvedCallTargets:[]}}]}}async getAccountContract(){const t=b.T.fromSigner(await this.getSigner(),this.config.chain,{clientId:this.config.clientId,secretKey:this.config.secretKey});return this.config.accountInfo?.abi?t.getContract(await this.getAddress(),this.config.accountInfo.abi):t.getContract(await this.getAddress(),G.A)}async getFactoryContract(){if(!this.config.factoryAddress)throw new Error("Factory address not set!");const t=b.T.fromSigner(await this.getSigner(),this.config.chain,{clientId:this.config.clientId,secretKey:this.config.secretKey});return this.config.factoryInfo?.abi?t.getContract(this.config.factoryAddress,this.config.factoryInfo.abi):t.getContract(this.config.factoryAddress)}defaultFactoryInfo(){return{createAccount:async(t,e)=>t.prepare("createAccount",[e,P.Y0("")]),getAccountAddress:async(t,e)=>await t.call("getAddress",[e,P.Y0("")])}}defaultAccountInfo(){return{execute:async(t,e,a,i)=>t.prepare("execute",[e,a,i]),getNonce:async t=>t.call("getNonce",[])}}async estimateTx(t,e){if(!this.accountApi||!this.aaProvider)throw new Error("Personal wallet not connected");let a=w.O$.from(0);const[i,r]=await Promise.all([this.getProvider(),this.isDeployed()]);r||(a=await this.estimateDeploymentGasLimit());const[s,n]=await Promise.all([this.accountApi.createUnsignedUserOp(this.aaProvider.httpRpcClient,t,e),(0,O.b)(i)]),o=await h.resolveProperties(s),c=w.O$.from(o.callGasLimit),d=c.mul(n),l=a.mul(n),u=l.add(d);return{ether:v.formatEther(u),wei:u,details:{deployGasLimit:a,transactionGasLimit:c,gasPrice:n,transactionCost:d,deployCost:l,totalCost:u}}}async estimateDeploymentGasLimit(){if(!this.accountApi)throw new Error("Personal wallet not connected");const t=await this.accountApi.getInitCode(),[e,a]=await Promise.all([this.accountApi.estimateCreationGas(t),this.accountApi.getVerificationGasLimit()]);return w.O$.from(a).add(e)}async prepareBatchRaw(t){if(!this.accountApi)throw new Error("Personal wallet not connected");const e=await Promise.all(t.map((t=>h.resolveProperties(t)))),a=e.map((t=>t.to||f.d)),i=e.map((t=>t.data||"0x")),r=e.map((t=>t.value||w.O$.from(0)));return{tx:await this.accountApi.prepareExecuteBatch(a,r,i),batchData:{targets:a,data:i,values:r}}}async prepareBatchTx(t){if(!this.accountApi)throw new Error("Personal wallet not connected");const e=t.map((t=>t.getTarget())),a=t.map((t=>t.encode())),i=await Promise.all(t.map((t=>t.getValue())));return{tx:await this.accountApi.prepareExecuteBatch(e,i,a),batchData:{targets:e,data:a,values:i}}}}}}]);