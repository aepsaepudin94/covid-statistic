import $ from 'jquery';
import Highcharts from 'highcharts';
import utils from '../utils.js';
import moment from 'moment';
import { isEmpty } from 'lodash';

class PageDetail extends HTMLElement {

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: "open" });
  }

  set data(data) {
    this._data = data;
    this.render();
  }

  showDetail() {
    const elem = this.shadowDOM.querySelector(`#detail-${this._data.CountryCode}`);
    const container = document.querySelector('.container');
    $(container).append(this);
    $(elem).slideDown(() => {
      this.createChart().then(() => {
        const customTableElem = document.querySelector('custom-table');
        customTableElem.bussy =  false;
      });
    });
  }

  createChart() {
    const startDate = moment().subtract('days', 7).format('YYYY-MM-DD');
    const endDate = moment().subtract('days', 1).format('YYYY-MM-DD');
    const { Slug } = this._data;
    const endPoint = `country/${Slug}?from=${startDate} 00:00:00&to=${endDate} 00:00:00`;
    const dateFromElem = this.shadowDOM.querySelector('.date-from');
    const dateToElem = this.shadowDOM.querySelector('.date-to');
    dateFromElem.innerHTML = moment(startDate).format('DD MMM YYYY');
    dateToElem.innerHTML = moment(endDate).format('DD MMM YYYY');
    const divChart = this.shadowDOM.querySelector('#detail__chart-container');

    $(divChart).append('<p class="info-loading">Wait a moment still loading data...</p>');
    return utils.loadData(endPoint).then((dt) => {

      $(divChart).find('.info-loading').remove();

      const categories = dt.map(dt => moment(dt.Date).format('DD MMM YYYY'));
      const series = dt.reduce((newDt, d) => {
        const { Confirmed, Deaths, Recovered } = d;

        if (isEmpty(newDt['Confirmed'])) {
          newDt['Confirmed'] = {
            name: 'Confirmed',
            data: []
          }
        }
        if (isEmpty(newDt['Deaths'])) {
          newDt['Deaths'] = {
            name: 'Deaths',
            data: []
          }
        }
        if (isEmpty(newDt['Recovered'])) {
          newDt['Recovered'] = {
            name: 'Recovered',
            data: []
          }
        }

        newDt['Confirmed']['data'].push(Confirmed);
        newDt['Deaths']['data'].push(Deaths);
        newDt['Recovered']['data'].push(Recovered);

        return newDt;
      }, {});

      Highcharts.chart(divChart, {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Covid Data From the Past 7 Days'
        },
        xAxis: {
          categories,
        },
        yAxis: {
          title: {
            text: 'Count'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: false
          }
        },
        series: Object.values(series)
      });
    });
  }

  backToTable() {
    return () => {
      const pageDetail = document.querySelector('page-detail');
      const elem = this.shadowDOM.querySelector(`#detail-${this._data.CountryCode}`);
      const tableElem = document.querySelector('custom-table');

      $(elem).slideUp(() => {
        $(tableElem).slideDown();
        $(pageDetail).remove();
      });
    }
  }

  render() {
    this.shadowDOM.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
      <style>
        .date-from, .date-to {
          font-weight: bold;
        }

        .info-loading {
          text-align: center;
        }
      </style>

      <div style="display: none;" id="detail-${this._data.CountryCode}" class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Covid Data Daily - <strong>${this._data.Country}<strong></h5>
              <h6 class="card-subtitle mb-2 text-muted">
                From
                <span class="date-from"></span>
                 to
                <span class="date-to"></span>
              </h6>
              <div id="detail__chart-container"></div>
              <hr>
              <button
                id="detail__page-back"
                type="button"
                class="btn btn-outline-primary my-2 my-sm-0">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    `;

    const btnBack = this.shadowDOM.querySelector('#detail__page-back');
    btnBack.addEventListener('click', this.backToTable());
  }
}

customElements.define('page-detail', PageDetail);