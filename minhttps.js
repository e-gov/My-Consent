/**
 * Minimaalne HTTPS server
 * ID-kaardiga autentimise uurimiseks
 */

'use strict';

/* Vajalike teekide laadimine */
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');
const https = require('https');
const express = require('express');

const app = express();

// Esilehe kuvamine
app.get('/', function (req, res) {
  console.log('avaleht');
  res.render('avaleht');
});

// -------- Defineeri HTTPS server -------- 
var HTTPS_S_options = {
  key: fs.readFileSync(
    path.join(__dirname, 'keys',
      'isetehtud.key'), 'utf8'),
  cert: fs.readFileSync(
    path.join(__dirname, 'keys',
      'isetehtud.cert'), 'utf8'),
  ca: [
    fs.readFileSync(path.join(__dirname, 'keys',
      'ESTEID-SK_2015.pem.crt'), 'utf8'),
    fs.readFileSync(path.join(__dirname, 'keys',
      'EE_Certification_Centre_Root_CA.pem.crt'), 'utf8')
  ],
  requestCert: false,
  rejectUnauthorized: false
};
// Kehtesta suvandid ja sea Express päringutöötlejaks
var httpsServer = https.createServer(HTTPS_S_options, app);

// Veebiserveri käivitamine 
httpsServer.listen(5000, () => {
  console.log('HTTPS server kuuldel pordil: ' + httpsServer.address().port);
});
