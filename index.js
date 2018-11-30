/*
  VOLLI-Exp - Eksperimentaalne nõusolekuteenus

  Priit Parmakson 2018
*/

'use strict';

/* Vajalike teekide laadimine */

/* Veebiraamistik Express */
const express = require('express');

/* Node.js krüptoteek */
const crypto = require('crypto');
/* Määra räsialgoritm - SHA256 */
const HASH_ALGO = 'sha256';

/* JWT töötlemise teek */
const jsonwebtoken = require('jsonwebtoken');

/* Veebiserveri ettevalmistamine */
const app = express();
/* Kui Heroku keskkonnamuutujas ei ole määratud teisiti,
 siis kasutatakse porti 80. */
app.set('port', (process.env.PORT || 80));

/* HTTP päringu keha töötlemise teek */
const bodyParser = require('body-parser');

/* Sea juurkaust, millest serveeritakse sirvikusse ressursse
 vt http://expressjs.com/en/starter/static-files.html 
 ja https://expressjs.com/en/4x/api.html#express.static */
app.use(express.static(__dirname + '/public'));

/* Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust */
app.set('views', __dirname + '/views');

/* Määra kasutatav mallimootor */
app.set('view engine', 'ejs');

/* Loo body-parser töötlema application/json päringuid */
var jsonParser = bodyParser.json();

/**
 *  Järgnevad marsruuteri töötlusreeglid
 */


/**
 * Esilehe kuvamine
 */
app.get('/', function (req, res) {
  res.render('pages/index');
});

/**
 * Tõendi moodustamine
 * AJAX-otspunkt,
 * võtab sirvikust tõendi keha, tagastab tõendi.
 */
app.post('/getJWT', jsonParser, function (req, res) {

  if (!req.body) {
    return res.status(500).json({ error: 'Tõendi keha ei tulnud päringus'});
  }

  console.log('Saadud päringukeha:');
  console.log(JSON.stringify(req.body));

  var jwt = jsonwebtoken.sign(
    req.body.toendiKeha,
    'Tõendi allkirja saladus',
    {
      "algorithm": "HS256",
      "issuer": "Volli-POC",
      "subject": "Nõusolekutõend"
    });

  res.status(200).json({ jwt: jwt});

});

/**
 * Veebiserveri käivitamine 
 */
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});


