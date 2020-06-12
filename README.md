# Covid Data Statistic

A simple page for view statistic data **Covid-19** all of Countries.

Sample live site [here](https://covid-statistic-data.herokuapp.com/)

## Project Structure

This project run and bundling by [Webpack](https://webpack.js.org/) and run an express server to deploy on [Heroku](https://id.heroku.com/).

File `server.js` it is for run on heroku. If you want try on local use this command `$ node server.js`, it will run on `localhost:8080`

## Project Setup

Clone project

  `$ git clone https://github.com/aepsaepudin94/covid-statistic.git`

Install Package

  `$ npm install`

Run on Development

  `$ npm run dev`

Build Project

  `$ npm run build`

## Delpoy Project to Heroku

Create App on your heroku dashboard

Login to your heroku account from your cli

Make sure you already install `heroku-cli`

`$ heroku login`

then add remote heroku repository on your project

`$ git remote add heroku <your app repository>`

Build and Deploy your project to heroku server

`$ git push heroku master`

