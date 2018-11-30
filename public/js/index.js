'use strict';

const Valjastusala = document.getElementById('Valjastusala');
const Teateala = document.getElementById('Teateala');

function alusta() {
  $('#Allkirjastan').click(() => {
    sign();
    // Valjastusala.textContent = 'OK';
  });

  var hashes = {};
  hashes['SHA-1'] = 'c33df55b8aee82b5018130f61a9199f6a9d5d385';
  hashes['SHA-224'] = '614eadb55ecd6c4938fe23a450edd51292519f7ffb51e91dc8aa5fbe';
  hashes['SHA-256'] = '413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2';
  hashes['SHA-384'] = '71839e04e1f8c6e3a6697e27e9a7b8aff24c95358ea7dc7f98476c1e4d88c67d65803d175209689af02aa3cbf69f2fd3';
  hashes['SHA-512'] = 'c793dc32d969cd4982a1d6e630de5aa0ebcd37e3b8bd0095f383a839582b080b9fe2d00098844bd303b8736ca1000344c5128ea38584bbed2d77a3968c7cdd71';
  hashes['SHA-192'] = 'ad41e82bcff23839dc0d9683d46fbae0be3dfcbbb1b49c70';

  function log_text(s) {
    var d = document.createElement("div");
    d.innerHTML = s;
    document.getElementById('Valjastusala').appendChild(d);
  }

  function debug() {
    window.hwcrypto.debug().then(function (response) { log_text("Debug: " + response); });
  }

  function sign() {
    // Clear log
    document.getElementById('Valjastusala').innerHTML = '';
    // Timestamp
    log_text("sign() clicked on " + new Date().toUTCString());

    if (!window.hwcrypto.use('auto')) {
      log_text("Selecting backend failed.");
    }

    var hashtype = hashes['SHA-256'];
    var hash = '413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2';
    log_text("Signing " + hashtype + ": " + hash);

    // debug
    window.hwcrypto.debug().then(function (response) {
      log_text("Debug: " + response);
    }, function (err) {
      log_text("debug() failed: " + err);
      return;
    });

    // Allkirjasta
    window.hwcrypto.getCertificate({ lang: 'et' })
      .then(function (response) {
        var cert = response;
        var certPEM = hexToPem(response.hex);
        log_text("Sert loetud:\n");
        window.hwcrypto.sign(
          cert,
          { type: hashtype, hex: hash },
          { lang: lang }
        )
          .then(function (response) {
            log_text("Moodustatud allkiri:\n" +
              response.hex.match(/.{1,64}/g).join("\n"));
          }, function (err) {
            log_text("Allkirjastamine ebaõnnestus: " + err);
          });
      }, function (err) {
        log_text("Allkirjastamine ebaõnnestus. Kontrolli, kas ID-kaart on lugejas. : "
          + err);
      });
  }
}