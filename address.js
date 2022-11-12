import { Cosmos } from "@cosmostation/cosmosjs";
import message from "@cosmostation/cosmosjs/src/messages/proto.js";

import { decode, encode, fromWords, toWords } from 'bech32';

const chainId = "reb_1111-1";
const REST_HOST = ""  
const ADDRESS_LENGTH = 44;
const cosmos = new Cosmos(REST_HOST, chainId);
const REBUS_PREFIX = "rebus";

//  get a random seed 
const mnemonic = cosmos.getRandomMnemonic(256);
cosmos.setBech32MainPrefix(REBUS_PREFIX);
// set the standard rebus derivation key (not evm address)
cosmos.setPath("m/44'/118'/0'/0/0"); 
let address = cosmos.getAddress(mnemonic);

console.log(mnemonic);
console.log(address);

let is_address_valid = false;
// check if address checksum is ok
try {
    let {prefix, words} = decode(address, ADDRESS_LENGTH);
    is_address_valid = true;
    console.log('prefix: ', prefix);
    // console.log('words: ', words);    
} catch (err) {
    is_address_valid = false;
    console.log(err);
}

console.log('address: ', address, ' is valid: ', is_address_valid)

