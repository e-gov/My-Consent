#!/usr/bin/env node
// Minimal example of loading a PEM certificate using pkijs (in node)

// babel-polyfill needs to be loaded for pkijs
// It uses webcrypto which needs browser shims
require('babel-polyfill')

const Pkijs = require('pkijs')
const Asn1js = require('asn1js')
const FS = require('fs')


function decodeCert(pem) {
    if(typeof pem !== 'string') {
        throw new Error('Expected PEM as string')
    }

    // Load certificate in PEM encoding (base64 encoded DER)
    const b64 = cert.replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, '')

    // Now that we have decoded the cert it's now in DER-encoding
    const der = Buffer(b64, 'base64')

    // And massage the cert into a BER encoded one
    const ber = new Uint8Array(der).buffer

    // And now Asn1js can decode things \o/
    const asn1 = Asn1js.fromBER(ber)

    return new Pkijs.Certificate({ schema: asn1.result })
}

function ab2str(hashBuffer) {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }
  
const certFile = process.argv[2]
if(certFile === undefined) {
    const file = require('path').basename(process.argv[1])
    console.error(`Usage: ${file} <pem_file>`)
    process.exit(1)
}

const cert = FS.readFileSync(certFile).toString()
// Prints out cert as a map data structure
// console.log(JSON.stringify(decodeCert(cert), null, 2))

dc = decodeCert(cert);

// Koosta objekt huvipakkuvatest elementidest
var h = new Object;

h['serialNumber'] = ab2str(dc.serialNumber.valueBlock.valueHex);

var issuer = '';
dc.issuer.typesAndValues.forEach((e) => {
    issuer = issuer + 
    ( (issuer === '') ? '' : ', ') + 
    e.value.valueBlock.value;
});

var subject = '';
dc.issuer.typesAndValues.forEach((e) => {
    subject = subject + 
    ( (subject === '') ? '' : ', ') + 
    e.value.valueBlock.value;
});

h['issuer'] = issuer;
h['subject'] = subject;

console.log(JSON.stringify(h));