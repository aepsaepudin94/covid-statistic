import $ from 'jquery';

class AppBar extends HTMLElement {

	constructor() {
		super()
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  set addEventSubmit(event) {
    this._onSubmitSearch = event;
    this.render();
  }

  set addEventResetSearch(event) {
    this._onResetSearch = event;
    this.render();
  }

  get valueSearch() {
    return this.querySelector("#covid__statictic-search").value;
  }

  render() {
    this.innerHTML = `
      <style>
        @media screen and (max-width: 600px) {
          #covid__statictic-submit-search,
          .form-navbar {
            width: 100%;
          }

          .p-navbar {
            margin-bottom: 0px;
            width: 100%;
            text-align: center;
            font-weight: bold;
          }
        }
        .p-navbar {
          margin-bottom: 0px;
          font-weight: bold;
        }
      </style>

      <nav class="navbar sticky-top navbar-dark bg-primary">
        <p class="p-navbar"><a class="navbar-brand">Covid Statistic</a></p>
        <form class="form-inline form-navbar">
          <input id="covid__statictic-search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button id="covid__statictic-submit-search" class="btn btn-outline-light my-2 my-sm-0" type="button">Search</button>
        </form>
      </nav>
    `;

    this.querySelector('#covid__statictic-submit-search').addEventListener('click', this._onSubmitSearch);

    const searchInput = this.querySelector('#covid__statictic-search');

    $(searchInput).on('search', this._onResetSearch);
    $('.form-navbar').submit(e => e.preventDefault() );
  }
}

customElements.define('app-bar', AppBar);