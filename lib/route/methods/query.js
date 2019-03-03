const Response = require('../response');
const _ = require('lodash');
const method = 'GET';

function Query(options) {
  const {path, name, Model, validate, beforeCreate, pre = [], auth} = options;
  return {
    method,
    path: `${path}`,
    config: {
      pre,
      auth,
      handler: async function (request) {
        const query = request.query;
        let filter;
        try {
          filter = JSON.parse(query.filter);
        } catch (ex) {
          filter = query.filter
        }

        try {
          if (!filter) {
            throw new Error('Query Filter cannot be undefined')
          }

          console.log('query', filter);
          const model = await Model.query(function (qb) {
            _.map(filter, (seed, value, key) => {
              if (typeof value === 'object') {
                _.map(value, (val, k) => {
                  console.log('val', val, 'k', k, 'key', key);
                  qb.where(key, k, val);
                });
                return;
              }

              qb.where(key, '=', value);
            });
          }).fetchAll({
            withRelated: Model.forge().customRelations,
          });

          return Response.success(name, model);
        } catch (ex) {
          console.log('query error', ex);
          return Response.badRequest(ex);
        }
      }
    }
  };
}


module.exports = Query;
