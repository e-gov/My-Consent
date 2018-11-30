'use strict';

const Valjastusala = document.getElementById('Valjastusala');
const Teateala = document.getElementById('Teateala');

function alusta() {
  $('#Allkirjastan').click(() => {
    sign();
    // Valjastusala.textContent = 'OK';
  });

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

    var hashtype = 'SHA-256';
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