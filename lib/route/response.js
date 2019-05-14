const Boom = require('boom');
const Tenses = require('../utils/tenses');
const _ = require('lodash');

class Response {
  static success(path, model, strippedColumns) {
    const obj = {};
    let routeName = Tenses.getSingular(path);
    model.attributes = (model && model.attributes && _.omit(model.attributes, strippedColumns)) || model.attributes;
    obj[routeName] = model;
    return obj;
  }

  static badRequest(err) {
    return Boom.badRequest(err);
  }

  static unauthorized(err) {
    return Boom.unauthorized(err);
  }
}

module.exports = Response;
