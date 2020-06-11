import { isEmpty } from 'lodash';
import './components/app-bar.js';
import './components/custom-table.js';
import dummyData from './data/data.js';
import $ from 'jquery';

const utils = {
  _tableElement: null,
  _navElement: null,
	initialize: () => {
    utils._tableElement = document.querySelector("custom-table");
    utils._navElement = document.querySelector("app-bar");

    $('.info-loading').show();
    utils.loadData('summary').then((dt) => {
      // dt = dummyData;
      $('.info-loading').hide();
      utils._tableElement.data = dt.Countries;
    });
    utils.addListener();
	},
  loadData: (method) => {
    return fetch(`https://api.covid19api.com/${method}`)
      .then(response => response.json());
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve([]);
    //   }, 2e3);
    // });
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