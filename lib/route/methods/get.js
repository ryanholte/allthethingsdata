const Response = require('../response');

function Get(options) {
  const {path, name, Model, validate, beforeCreate, pre = [], auth, strippedColumns} = options;
  return {
    method: 'GET',
    path: `${path}/{id}`,
    config: {
      pre,
      auth,
      handler: async function (request) {
        const id = request.params.id;

        console.log('id', id);
        try {
          const model = await Model.find(id);
          return Response.success(name, model, strippedColumns);
        } catch (ex) {
          console.log('get error', ex);
          return Response.badRequest(ex);
        }

      }
    }
  };
};

module.exports = Get;
