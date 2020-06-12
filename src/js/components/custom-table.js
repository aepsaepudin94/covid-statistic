import numeral from 'numeral';
import $ from 'jquery';
import { isNull, orderBy, isEmpty, debounce, lowerCase } from 'lodash';
import Sortable from 'sortablejs';
import localforage from 'localforage';
import Swal from 'sweetalert2';
import './page-detail.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class CustomTable extends HTMLElement {

  constructor() {
    super();
    this._key_setting = 'field_setting';
    this._isBussy = false;
    this._default_fields = [
      {
        key: 'number',
        title: '#',
        show: true,
        position: 1
      },
      {
        key: 'flag',
        title: 'Flag',
        show: true,
        sort: false,
        position: 2
      },
      {
        key: 'Country',
        title: 'Country',
        show: true,
        sort: true,
        position: 3
      },
      {
        key: 'NewConfirmed',
        title: 'New Confirmed',
        show: true,
        format: '0,0',
        sort: true,
        position: 4
      },
      {
        key: 'TotalConfirmed',
        title: 'Total Confirmed',
        show: true,
        format: '0,0',
        sort: true,
        position: 5
      },
      {
        key: 'NewDeaths',
        title: 'New Deaths',
        show: true,
        format: '0,0',
        sort: true,
        position: 6
      },
      {
        key: 'TotalDeaths',
        title: 'Total Deaths',
        show: true,
        format: '0,0',
        sort: true,
        position: 7
      },
      {
        key: 'NewRecovered',
        title: 'New Recovered',
        show: true,
        format: '0,0',
        sort: true,
        position: 8
      },
      {
        key: 'TotalRecovered',
        title: 'Total Recovered',
        show: true,
        format: '0,0',
        sort: true,
        position: 9
      },
      {
        key: 'action',
        title: 'Action',
        show: true,
        position: 10
      },
    ];
  }

  set data(data) {
    this._data = data;
    this.render();
  }

  set bussy(bussy) {
    this._isBussy = bussy;
    this.render();
  }

  get fields() {
    return this._default_fields;
  }

  async getCurrentFields() {
    const saved = await localforage.getItem(this._key_setting) || [];
    if (!isEmpty(saved)) return saved;
    return this._default_fields;
  }

  formatNumber(value, formatVal = null) {
    if (!isNull(formatVal)) {
      return numeral(value).format(formatVal);
    }
    return value;
  }

  resetTableSetting() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this table setting!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(result => {
      if (result.value) {
        localforage.setItem(this._key_setting, [])
          .then(() => localforage.getItem(this._key_setting))
          .then(dt => {
            Swal.fire(
              'Deleted!',
              'Your table setting has been deleted.',
              'success'
            ).then(() => this.render());
          })
          .catch(err => {
            Swal.fire(
              'Error',
              'Ouh something error on our system :(',
              'error'
            )
          });
      }
    });
  }

  saveNewSettingFields() {
    return new Promise((resolve, reject) => {
      let configs = [];
      const fieldSettings = this.querySelectorAll('#table__setting-fields li');

      $(fieldSettings).each(function (i, e) {
        const config = $(this).data();
        const fName = $(this).find(`#field-name_${config.key}`).val().trim();
        const fShow = $(this).find(`#field-show_${config.key}`).is(':checked');
        config['title'] = fName;
        config['show'] = fShow;
        config['position'] = i + 1;
        configs.push(config);
      });

      return localforage.setItem(this._key_setting, configs)
        .then(() => localforage.getItem(this._key_setting))
        .then(dt => resolve(dt))
        .catch(err => reject(err));
    });
  }

  addEventClickDetail() {
    this._data.forEach(dt => {
      const elemTarget = this.querySelector(`#covid__statictic-table-detail--${dt.CountryCode}`);
      if (elemTarget) {
        const onClickDetail = (detail) => {
          return () => {
            if (this._isBussy) return;

            this._isBussy = true;
            const tablePage = document.querySelector('custom-table');
            const pageDetailelem = document.createElement('page-detail');
            pageDetailelem.data = detail;

            $(tablePage).slideUp(() => {
              pageDetailelem.showDetail();
            });
          };
        }
        elemTarget.addEventListener('click', onClickDetail(dt));
      }
    });
  }

  async updateTable(filterValue = null) {
    const sortBy = this.querySelector('#covid__statictic-sort-select').value || 'Country';
    const sortDirection = this.querySelector('#covid__statictic-sort-direction').value || 'asc';

    let fields = await this.getCurrentFields();
        fields = orderBy(fields, ['position'], ['asc']);
    const mainTable = this.querySelector('#covid__statictic-main-table');
    const selectSort = this.querySelectorAll('#covid__statictic-sort-select');

    $(mainTable).find('thead tr').empty();
    fields.forEach(field => {
      const { show: isShow } = field;
      if (!isShow) return true;
      $(mainTable).find('thead tr').append(`<th scope="col">${field.title}</th>`);
    });

    fields.forEach(field => {
      const { show, key, title } = field;
      const optionTarget = $(selectSort).find(`option[value=${key}]`);

      if (optionTarget.length == 0) return true;

      $(optionTarget).text(`${title}`);

      if (show) {
        $(optionTarget).show();
      } else {
        $(optionTarget).hide();
      }
    });

    $(mainTable).find('tbody').empty();
    let number = 1;
    let data = orderBy(this._data, [sortBy], [sortDirection]);

    if (!isNull(filterValue)) {
      data = data.filter(dt => {
        const countryName = lowerCase(dt.Country);
        const keyword = lowerCase(filterValue);
        return countryName.indexOf(keyword) != -1;
      });
    }

    data.forEach(dt => {
      const { CountryCode } = dt;
      const row = document.createElement('tr');
      fields.forEach(field => {
        const { key: fdKey, show: isShow, format: formatVal = null } = field;
        let td = ''
        if (!isShow) return true;
        if (fdKey == 'number') {
          td += `<td>${number}</td>`;
        } else if (fdKey == 'flag') {
          td += `<td><img src="https://www.countryflags.io/${CountryCode}/flat/64.png" class="mr-3" alt="${CountryCode}"></td>`;
        } else if (fdKey == 'action') {
          td += `
            <td>
              <button
                id="covid__statictic-table-detail--${CountryCode}"
                class="btn btn-outline-light my-2 my-sm-0">Detail
              </button>
            </td>`;
        } else {
          td += `<td>${this.formatNumber(dt[fdKey], formatVal)}</td>`;
        }
        $(row).append(td);
      });
      number++;
      $(mainTable).find('tbody').append(row);
    });

    this.addEventClickDetail();
  }

  createElemSort(fields) {
    const self = this;
    const sortSelecElem = this.querySelector('#covid__statictic-sort-select');
    $(sortSelecElem).empty();
    fields.forEach(field => {
      const { show: isShow, sort: isUseSort, title, key } = field;
      if (!isUseSort) return true;
      const optSort = document.createElement('option');
      optSort.value = key;
      optSort.innerHTML = `${title}`;
      sortSelecElem.appendChild(optSort);
      if (isShow) {
        $(optSort).show();
      } else {
        $(optSort).hide();
      }
    });

    $(sortSelecElem).change(function () {
      setTimeout(() => {
        self.updateTable();
      }, 5e2);
    });
  }

  async render() {
    let content = `
      <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
      <style>
        #table__setting-fields {
          max-height: 300px;
          overflow-y: auto;
        }

        .move-field {
          cursor: ns-resize;
        }

        @media screen and (min-width: 601px) {
          .label-covid__statictic-sort-select {
            margin-left: 5px;
          }

          #table__reset-setting {
            position: absolute;
            right: 15px;
          }
        }

        @media screen and (max-width: 600px) {
          .move-field {
            margin-left: 5px;
          }

          #table__setting-collapse,
          #table__reset-setting,
          #covid__statictic-submit-search,
          .form-navbar {
            width: 100%;
          }
        }
      </style>
    `;

    let fields = await this.getCurrentFields();
        fields = orderBy(fields, ['position'], ['asc']) ;
    let table = `
      <div class="row">
        <div class="col-sm-12">
          <div class="covid__statictic-table-manage">
            <form class="form-inline">
              <button
                id="table__setting-collapse"
                type="button"
                class="btn btn-outline-primary my-2 my-sm-0">
                Show Table Setting
              </button>
              <label class="my-1 mr-2 label-covid__statictic-sort-select" for="covid__statictic-sort-select">Sort By</label>
              <select class="custom-select my-1 mr-sm-2" id="covid__statictic-sort-select"></select>
              <label class="my-1 mr-2" for="covid__statictic-sort-direction">Sort Direction</label>
              <select class="custom-select my-1 mr-sm-2" id="covid__statictic-sort-direction">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <button
                id="table__reset-setting"
                type="button"
                class="btn btn-outline-warning my-2 my-sm-0 pull-right">
                Reset Table Setting
              </button>
            </form>
            <div class="collapse" id="table__setting-container">
              <div class="card card-body">
                <ul id="table__setting-fields" class="list-group"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 12px;" class="row">
        <div class="col-sm-12">
          <div class="table-responsive">
            <table id="covid__statictic-main-table" class="table table-striped table-hover table-dark">`;

    // setup fields
    table += `<thead><tr>`;
    fields.forEach(field => {
      const { show: isShow } = field;
      if (!isShow) return true;
      table += `<th scope="col">${field.title}</th>`;
    });
    table += '</tr></thead>';

    // setup data
    let number = 1;
    this._data.forEach(dt => {
      table += '<tr>';
      for (let i = 0; i < fields.length; i++) {
        const { key: fdKey, show: isShow, format: formatVal = null } = fields[i];
        if (!isShow) continue;
        if (fdKey == 'number') {
          table += `<td>${number}</td>`;
        } else if (fdKey == 'flag') {
          table += `<td><img src="https://www.countryflags.io/${dt.CountryCode}/flat/64.png" class="mr-3" alt="${dt.CountryCode}"></td>`;
        } else if (fdKey == 'action') {
          table += `
            <td>
              <button
                id="covid__statictic-table-detail--${dt.CountryCode}"
                class="btn btn-outline-light my-2 my-sm-0">Detail
              </button>
            </td>`;
        } else {
          table += `<td>${this.formatNumber(dt[fdKey], formatVal)}</td>`;
        }
      }
      table += '</tr>';
      number++;
    });

    table += `
            </table>
          </div>
        </div>
      </div>`;
    content += table;

    this.innerHTML = content;

    // setup select sort
    this.createElemSort(fields);

    // setup fields setting
    const listFieldSetting = this.querySelector('#table__setting-fields');
    fields.forEach(field => {
      const { key, title, show } = field;
      const isShow = show ? 'checked' : '';
      const itemSetting = `
        <li id="${key}" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="form-inline">
            <label class="my-1 mr-2" for="field-name_${key}">Field Name</label>
            <input type="text" id="field-name_${key}" value="${title}" class="form-control mx-sm-3 field-name">
            <div class="custom-control custom-checkbox my-1 mr-sm-2">
              <input type="checkbox" class="custom-control-input field-show" id="field-show_${key}" ${isShow}>
              <label class="custom-control-label" for="field-show_${key}">Show</label>
            </div>
          </div>
          <span title="Move" class="badge badge-primary badge-pill move-field">
            <i class="fa fa-fw fa-arrows"></i>
          </span>
        </li>`;
      $(listFieldSetting).append(itemSetting);
      $(listFieldSetting).find(`#${key}`).data(field);
    });

    // setup sortable
    const tableSetting = this.querySelector('#table__setting-fields');
    Sortable.create(tableSetting, {
      handle: '.move-field',
      animation: 150,
      onEnd: async () => {
        await this.saveNewSettingFields();
        this.updateTable();
      }
    });

    // add event listener sort direction
    const sortDirectionElem = this.querySelector('#covid__statictic-sort-direction');
    const self = this;
    $(sortDirectionElem).change(function () {
      setTimeout(() => {
        self.updateTable();
      }, 5e2);
    });

    // add event listener detail
    this.addEventClickDetail();

    // add event listener field show setting
    $(tableSetting).find('.field-show').change(async () => {
      await this.saveNewSettingFields();
      this.updateTable();
    });

    // add event listener keyup field name
    $(tableSetting).find('.field-name').keyup(debounce(async () => {
      await this.saveNewSettingFields();
      this.updateTable();
    }, 8e2));

    // add event listener button setting
    const btnCollapse = this.querySelector('#table__setting-collapse');
    const collapseContainer = this.querySelector('#table__setting-container');
    btnCollapse.addEventListener('click', () => {
      const styleContainer = window.getComputedStyle(collapseContainer);
      const isVisible = styleContainer.display !== 'none';

      if (isVisible) {
        $(collapseContainer).slideUp();
        btnCollapse.innerHTML = 'Show Table Setting';
      } else {
        $(collapseContainer).slideDown();
        btnCollapse.innerHTML = 'Hide Table Setting';
      }
    });

    // add event listener button reset setting
    const btnResetSetting = this.querySelector('#table__reset-setting');
    btnResetSetting.addEventListener('click', () => {
      this.resetTableSetting();
    });
  }
}

customElements.define('custom-table', CustomTable);