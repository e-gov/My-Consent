'use strict';

const Valjastusala = document.getElementById('Valjastusala');
const Teateala = document.getElementById('Teateala');

function alusta() {
  $('#AnnaNousolekNupp').click(() => {
    Valjastusala.textContent = 'OK';
  });
}