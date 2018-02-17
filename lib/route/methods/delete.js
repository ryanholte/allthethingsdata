const Response = require('../response');
const method = 'delete';

function Delete(path, name, Model) {
  return {
    method,
    path: `${path}/{id}`,
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
  };
};

module.exports = Delete;
