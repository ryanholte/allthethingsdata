const Response = require('../response');
const method = 'delete';

function Delete(options) {
  const {path, name, Model, validate, beforeCreate, pre = [], auth} = options;

  return {
    method,
    path: `${path}/{id}`,
    config: {
      pre,
      auth,
      handler: async function (request) {
        const id = request.params.id;
        try {
          const model = await Model.delete(id);
          return Response.success(name, model);
        } catch (ex) {
          console.log('get error', ex);
          return Response.badRequest(ex);
        }

      }
    }
  };
};

module.exports = Delete;
