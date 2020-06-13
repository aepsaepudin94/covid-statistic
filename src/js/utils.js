import { isEmpty } from 'lodash';
import './components/app-bar.js';
import './components/custom-table.js';
import $ from 'jquery';

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
    utils.addListener();
	},
  loadData: (method) => {
    return fetch(`https://api.covid19api.com/${method}`)
      .then(response => response.json()).catch(err => {
        Swal.fire(
          'Error',
          `Ouh something error on our system :( <br>
          <strong> ${err} </strong>`,
          'error'
        );
      });
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
      utils._tableElement.updateTable();
    };
  }
};

export default utils;