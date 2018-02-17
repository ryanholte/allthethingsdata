const Tenses = require('../../utils/tenses');
const Response = require('../response');

const method = 'put';

function Put(path, name, Model, validate) {
  return {
    method,
    path: `${path}/{id}`,
    config: {
      pre: [{
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
      }],
      handler: async function (request) {
        const record = request.payload[Tenses.getSingular(name)];
        const id = request.params.id;

        try {
          const updatedRecord = await Model.update(id, record);
          return Response.success(name, updatedRecord);
        } catch (ex) {
          return Response.badRequest(ex);
        }
      }
    }
  };
};

module.exports = Put;
