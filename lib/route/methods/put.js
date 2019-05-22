const Tenses = require('../../utils/tenses');
const Response = require('../response');

const method = 'put';

function Put(options) {
  const {
    path,
    name,
    Model,
    validate,
    beforeCreate,
    beforeUpdate,
    pre = [],
    auth,
    strippedColumns
  } = options;
  const validateSutff = {
    method: async function (request) {
      try {
        if (!request.params.id) {
          return Response.badRequest('ID is required for PUTs!');
        }
        if (Number.isNaN(Number(request.params.id))) {
          return Response.badRequest('ID must be a number!');
        }
        return validate(method, request.payload[Tenses.getSingular(name)])
      } catch (ex) {
        return Response.unauthorized(ex);
      }
    },
    assign: 'validate',
  };

  return {
    method,
    path: `${path}/{id}`,
    config: {
      pre: [].concat(pre, validateSutff),
      auth,
      handler: async function (request) {
        const record = request.payload[Tenses.getSingular(name)];
        const id = request.params.id;

        try {

          const query = Model.update(id, record);
          if (beforeUpdate) {
            beforeUpdate('put', request, query._knex);
          }
          const responseArr = await query.query();
          let model = null;
          if (responseArr.length) {
            model = Model.forge(responseArr.pop());
          }


          return Response.success(name, model, strippedColumns);
        } catch (ex) {
          return Response.badRequest(ex);
        }
      }
    }
  };
};

module.exports = Put;
