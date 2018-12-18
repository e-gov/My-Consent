'use strict';

function alusta() {

  function logi(teade) {
    $('#logi').append('<br>' + teade);
  }

  $('#kontrolliNupp').click(() => {

    logi("Alustan...");

    if (!window.hwcrypto.use('auto')) {
      logi("Selecting backend failed.");
    }

    window.hwcrypto.debug()
      .then(
        (response) => {
          logi("Debug: " + response);
        },
        (err) => {
          logi("debug() failed: " + err);
          return;
        });

    window.hwcrypto.getCertificate({ lang: 'et' })
      .then(
        function (response) {
          var cert = response;
          var certPEM = hexToPem(response.hex);
          logi("Sert loetud:\n");
        },
        function (err) {
          logi("Serdi lugemine ebaõnnestus. Kontrolli, kas ID-kaart on lugejas. : "
            + err);
        }
      );
  });

  logi('Laetud...');
}

