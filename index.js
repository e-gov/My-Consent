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

/* Veebiserveri ettevalmistamine */
const app = express();
/* Kui Heroku keskkonnamuutujas ei ole määratud teisiti,
 siis kasutatakse porti 5000. */
app.set('port', (process.env.PORT || 5000));

/* Sea juurkaust, millest serveeritakse sirvikusse ressursse
 vt http://expressjs.com/en/starter/static-files.html 
 ja https://expressjs.com/en/4x/api.html#express.static */
app.use(express.static(__dirname + '/public'));

/* Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust */
app.set('views', __dirname + '/views');

/* Määra kasutatav mallimootor */
app.set('view engine', 'ejs');

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
 * Veebiserveri käivitamine 
 */
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});


