/**
 * Uurin ID-kaardi käitumist
 */

'use strict';

/* Vajalike teekide laadimine */
const fs = require('fs'); // Sertide laadimiseks
const path = require('path');
const http = require('http');
const https = require('https');

/* Veebiraamistik Express */
const express = require('express');

/* Veebiserveri ettevalmistamine */
const app = express();

/* Sea juurkaust, millest serveeritakse sirvikusse ressursse
 vt http://expressjs.com/en/starter/static-files.html 
 ja https://expressjs.com/en/4x/api.html#express.static */
app.use(express.static(__dirname + '/public'));

/* Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust */
app.set('views', __dirname + '/views');

/* Määra kasutatav mallimootor */
app.set('view engine', 'ejs');

// Järgnevad marsruuteri töötlusreeglid

// Esilehe kuvamine
app.get('/', function (req, res) {
  console.log('abi');
  console.log(req.connection.getProtocol()); // Töötab!
  if (req.connection.authorized) {
    console.log('klient autenditud');
  }
  else {
    console.log('klient autentimata');
  }
  req.connection.renegotiate(
    {
      requestCert: true,
      rejectUnauthorized: true
    },
    (e) => {
      if (e == null) {
        console - log('edukas');
      } else {
        console.log(e.toString());
      }
    });
  // var kliendisert = req.connection.getPeerCertificate();
  // console.log(kliendisert.fingerprint);
  res.render('pages/id-kaardi-uuring-avaleht');
});

// Teise lehe kuvamine
app.get('/teine', function (req, res) {
  // Siin saab tellida TLS seansi ümberkätluse
  // https://nodejs.org/api/tls.html#tls_tlssocket_renegotiate_options_callback
  res.render('pages/id-kaardi-uuring-teine');
});

// -------- Defineeri HTTPS server -------- 
// Valmista ette HTTPS serveri suvandid
// Kui tahad kontrollida pöörduja ID-kaarti, siis pead siin paigaldama
// SK juur- ja vaheserdi.
// https://www.sk.ee/en/Repository/certs/rootcertificates 
// Kuidas seda teha, vt:
// https://gist.github.com/andris9/1132553 
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
var httpServer = http.createServer(app);

// Veebiserveri käivitamine 
httpsServer.listen(5000, () => {
  console.log('HTTPS server kuuldel pordil: ' + httpsServer.address().port);
});
httpServer.listen(8000, () => {
  console.log('HTTP server kuuldel pordil: ' + httpServer.address().port);
});
