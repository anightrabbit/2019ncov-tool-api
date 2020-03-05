const Router = require('express');
const Controller = require('../controllers/2019ncov.controller');

const routes = new Router();

routes
  .route('/')
  .get(Controller.query)
  .post(Controller.createAndUpdate);

module.exports = routes;
