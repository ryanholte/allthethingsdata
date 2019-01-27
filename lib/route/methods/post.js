const Tenses = require('../../utils/tenses');
const Response = require('../response');
const method = 'post';

function Post(options) {
  const {path, name, Model, validate, beforeCreate, pre = [], auth} = options;

  const validatePre = [{
    method: async function (request) {
      try {
        return validate(method, request.payload[Tenses.getSingular(name)])
      } catch (ex) {
        return Response.unauthorized(ex);
      }
    },
    assign: 'validate',
  }];

  const preHandlers = [].concat(validatePre, pre);

  return {
    method,
    path: `${path}`,
    config: {
      auth: 'jwt',
      pre: preHandlers,
      handler: async function (request) {
        const record = request.payload[Tenses.getSingular(name)];

        console.log('sing', Tenses.getSingular(name));
        console.log('record', record);
        console.log('payload', request.payload);

        try {
          if (!record) {
            throw new Error('Post Method: Cannot create a null record');
          }

          if (beforeCreate) {
            beforeCreate(record, request);
          }

          const createdRecord = await Model.create(record);
          return Response.success(name, createdRecord);
        } catch (ex) {
          return Response.badRequest(ex);
        }
      }
    }
  };
};

module.exports = Post;
