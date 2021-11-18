let net = require('net');
let args = require('minimist')(process.argv.slice(2));

const ip = args.ip || "127.0.0.1";
const port = args.port || 80;

var client = new net.Socket();

import * as CDR from './Classes/CallDetailRecord';

let newCDR = new CDR.CallDetailRecord("");

console.log('Running CDR Handler Service');

console.log(newCDR);