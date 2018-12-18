'use strict';

function logi(teade) {
  $('#logi').append('<br>' + teade);
}

function alusta() {

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
          var certPEM = hexToPem(response.hex);
          logi("Sert loetud:\n");
          kuvaSert(certPEM);
        },
        function (err) {
          logi("Serdi lugemine ebaõnnestus. Kontrolli, kas ID-kaart on lugejas. : "
            + err);
        }
      );
  });


  function kuvaSert(cert) {
    // Tee AJAX-pöördumine serveri poolele sserdi dekodeerimiseks
    $.ajax(
      'https://volli-poc.herokuapp.com/decodeCert',
      {
        data: JSON.stringify({
          cert: cert }),
        contentType: 'application/json',
        type: 'POST',
        success: (data, status) => {
          console.log('kuvaSert: POST vastus: : ' +
            JSON.stringify(data.serditeave, undefined, 2));
          $('#Tulem').text(JSON.stringify(data.dekodeeritudSert, undefined, 2));
          console.log('kuvaSert: POST vastus: status: ' + status);
          if (status !== 'success') {
            logi('Serdi dekodeerimine ebaõnnestus. :(');
            return
          }
        },
        error: (jqXHR, status, error) => {
          logi('Serdi dekodeerimine ebaõnnestus. :(');
        }
      }
    );


  }

  logi('Laetud...');
}

