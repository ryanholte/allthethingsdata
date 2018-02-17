const Tenses = require('../../utils/tenses');
const Response = require('../response');
const method = 'post';

function Put(path, name, Model, validate) {
  return {
    method,
    path: `${path}`,
    config: {
      pre: [{
        method: async function (request) {
          try {
            return validate(method, request.payload[Tenses.getSingular(name)])
          } catch (ex) {
            return Response.unauthorized(ex);
          }
        },
        assign: 'validate',
      }],
      handler: async function (request) {
        const record = request.payload[Tenses.getSingular(name)];

        console.log('sing', Tenses.getSingular(name));
        console.log('record', record);
        console.log('payload', request.payload);

        try {
          const createdRecord = await Model.create(record);
          return Response.success(name, createdRecord);
        } catch (ex) {
          return Response.badRequest(ex);
        }
      }
    }
  };
};

module.exports = Put;
