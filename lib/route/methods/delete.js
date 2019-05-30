const Response = require('../response');
const method = 'delete';

function Delete(options) {
  const {path, name, Model, validate, beforeDelete, pre = [], auth, strippedColumns} = options;

  return {
    method,
    path: `${path}/{id}`,
    config: {
      pre,
      auth,
      handler: async function (request) {
        const id = request.params.id;
        try {

          const query = Model.delete(id);
          if (beforeDelete) {
            beforeDelete('delete', request, query._knex);
          }
          const responseArr = await query.query();
          let model = null;
          if (responseArr.length) {
            model = Model.forge(responseArr.pop());
          }

          return Response.success(name, model, strippedColumns);
        } catch (ex) {
          console.log('get error', ex);
          return Response.badRequest(ex);
        }

      }
    }
  };
};

module.exports = Delete;
