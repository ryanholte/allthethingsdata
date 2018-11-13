const Response = require('../response');
const _ = require('lodash');
const method = 'GET';

function Query(path, name, Model) {
  return {
    method,
    path: `${path}`,
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

        console.log('query', query);
        const model = await Model.query(function (qb) {
          _.reduce(filter, (seed, value, key) => {
            if (typeof value === 'object') {
              _.map(value, (val, k) => {
                qb.where(key, k, val);
              });
            }
          }, {});
        }).fetchAll({
          withRelated: Model.forge().customRelations,
        });

        return Response.success(name, model);
      } catch (ex) {
        console.log('query error', ex);
        return Response.badRequest(ex);
      }

    }
  };
}


module.exports = Query;
