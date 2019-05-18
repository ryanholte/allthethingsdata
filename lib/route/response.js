const Boom = require('boom');
const Tenses = require('../utils/tenses');
const _ = require('lodash');

class Response {
  static success(path, model, strippedColumns) {
    const obj = {};
    let routeName = Tenses.getSingular(path);


    if (model && model.relations) {
      model.relations = _.reduce(model.relations, (seed, childModel, key) => {
        seed[key] = childModel.stripColumns();
        return seed;
      }, {});
    }

    obj[routeName] = (model && model.stripColumns()) || model;
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
