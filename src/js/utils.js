import { isEmpty } from 'lodash';
import './components/app-bar.js';
import './components/custom-table.js';
import $ from 'jquery';
import Swal from 'sweetalert2';

const utils = {
  _tableElement: null,
  _navElement: null,
	initialize: () => {
    utils._tableElement = document.querySelector("custom-table");
    utils._navElement = document.querySelector("app-bar");

    $('.info-loading').show();
    utils.loadData('summary').then((dt) => {
      $('.info-loading').hide();
      utils._tableElement.data = dt.Countries;
    });
    utils.registerSw();
    utils.addListener();
	},
  loadData: (method) => {
    const baseUrl = 'https://api.covid19api.com';
    const showAlertOffline = () => {
      Swal.fire(
        'Offline',
        `You are offline now :( <br>
          <strong> Please check your connection </strong>`,
        'warning'
      );
    };
    const isOffline = !navigator.onLine;

    if (isOffline) {
      if ('caches' in window) {
        return caches.match(`${baseUrl}/${method}`).then(response => {
          if (response) return response.json();
          showAlertOffline();
        });
      }

      showAlertOffline();
      return;
    }

    return fetch(`${baseUrl}/${method}`)
      .then(response => response.json()).catch(err => {
        Swal.fire(
          'Error',
          `Ouh something error on our system :( <br>
          <strong> ${err} </strong>`,
          'error'
        );
      });
  },
  registerSw: () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("../service-worker.js")
          .then(function () {
            console.log("Pendaftaran ServiceWorker berhasil");
          })
          .catch(function () {
            console.log("Pendaftaran ServiceWorker gagal");
          });
      });
    } else {
      console.log("ServiceWorker belum didukung browser ini.");
    }
  },
  addListener: () => {
    utils._navElement.addEventSubmit = (e) => {
      e.preventDefault();
      const findKeyword = utils._navElement.valueSearch;
      if (isEmpty(findKeyword)) return;
      utils._tableElement.updateTable(findKeyword);
    };

    utils._navElement.addEventResetSearch = (e) => {
      e.preventDefault();
      const findKeyword = utils._navElement.valueSearch || null;
      utils._tableElement.updateTable(findKeyword);
    };
  }
};

export default utils;