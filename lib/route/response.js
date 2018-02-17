const Boom = require('boom');
const Tenses = require('../utils/tenses');

class Response {
  static success(path, model) {
    const obj = {};
    let routeName = Tenses.getSingular(path);
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
