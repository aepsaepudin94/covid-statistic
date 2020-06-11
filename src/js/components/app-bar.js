import $ from 'jquery';

class AppBar extends HTMLElement {

	constructor() {
		super()
		this.shadowDOM = this.attachShadow({ mode: 'open' });
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
    return this.shadowDOM.querySelector("#covid__statictic-search").value;
  }

  render() {
    this.shadowDOM.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
      <style>
        @media screen and (min-width: 601px) {
          #covid__statictic-reset-search {
            margin-right: 5px;
          }
        }

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
          <button id="covid__statictic-submit-search" class="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
        </form>
      </nav>

      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    `;

    this.shadowDOM.querySelector('#covid__statictic-submit-search').addEventListener('click', this._onSubmitSearch);

    const searchInput = this.shadowDOM.querySelector('#covid__statictic-search');
    $(searchInput).on('search', this._onResetSearch);
  }
}

customElements.define('app-bar', AppBar);