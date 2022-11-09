import { Cosmos } from "@cosmostation/cosmosjs";
import message from "@cosmostation/cosmosjs/src/messages/proto.js";


const mnemonic = "seed phrase";

const chainId = "reb_1111-1";

const REST_HOST = "https://api.rebuschain.com:1317"  
// const REST_HOST = "https://api.mainnet.rebus.money:1317"  


const cosmos = new Cosmos(REST_HOST, chainId);
cosmos.setBech32MainPrefix("rebus");
cosmos.setPath("m/44'/118'/0'/0/0");
const address = cosmos.getAddress(mnemonic);
const privKey = cosmos.getECPairPriv(mnemonic);
const pubKeyAny = cosmos.getPubKeyAny(privKey);



cosmos.getAccounts(address).then(data => {
	
	// log account data
    let account = data.account.base_account;
	console.log(account)
	

    // prepare the tx
	const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
		from_address: address,
		to_address: "rebus1qv03wld9lqx3d30qp0jjjp7m4safq24z58q0fq", 
		amount: [{ denom: "arebus", amount: String(1000000000000000000) }]		// 1 rebus = 1e18 arebus 
	});


    // format the msg tx send 
	const msgSendAny = new message.google.protobuf.Any({
		type_url: "/cosmos.bank.v1beta1.MsgSend",
		value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
	});


    // format the msg tx add the memo field 
    let memo = "1234" // memo field content
	const txBody = new message.cosmos.tx.v1beta1.TxBody({ messages: [msgSendAny], memo: memo });

    // signature info
    const signerInfo = new message.cosmos.tx.v1beta1.SignerInfo({
		public_key: pubKeyAny,
		mode_info: { single: { mode: message.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT } },
		sequence: account.sequence
	});


    // fee values
	const feeValue = new message.cosmos.tx.v1beta1.Fee({
		amount: [{ denom: "arebus", amount: String(5000) }],
		gas_limit: 200000
	});


    // format the auth info
	const authInfo = new message.cosmos.tx.v1beta1.AuthInfo({ signer_infos: [signerInfo], fee: feeValue });

    // sign the tx
    const signedTxBytes = cosmos.sign(txBody, authInfo, account.account_number, privKey);

    // broadcast the tx
	cosmos.broadcast(signedTxBytes).then(response => console.log(response));
});
