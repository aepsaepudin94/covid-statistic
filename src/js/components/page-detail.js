import $ from 'jquery';
import Highcharts from 'highcharts';
import utils from '../utils.js';
import moment from 'moment';
import { isEmpty } from 'lodash';

class PageDetail extends HTMLElement {

  set data(data) {
    this._data = data;
    this.render();
  }

  showDetail() {
    const elem = this.querySelector(`#detail-${this._data.CountryCode}`);
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
    const dateFromElem = this.querySelector('.date-from');
    const dateToElem = this.querySelector('.date-to');
    dateFromElem.innerHTML = moment(startDate).format('DD MMM YYYY');
    dateToElem.innerHTML = moment(endDate).format('DD MMM YYYY');
    const divChart = this.querySelector('#detail__chart-container');

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
            enableMouseTracking: true
          }
        },
        series: Object.values(series)
      });
    });
  }

  backToTable() {
    return () => {
      const pageDetail = document.querySelector('page-detail');
      const elem = this.querySelector(`#detail-${this._data.CountryCode}`);
      const tableElem = document.querySelector('custom-table');

      $(elem).slideUp(() => {
        $(tableElem).slideDown();
        $(pageDetail).remove();
      });
    }
  }

  render() {
    this.innerHTML = `
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
    `;

    const btnBack = this.querySelector('#detail__page-back');
    btnBack.addEventListener('click', this.backToTable());
  }
}

customElements.define('page-detail', PageDetail);