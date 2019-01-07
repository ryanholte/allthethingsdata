const Response = require('../response');

function Get(path, name, Model) {
  return {
    method: 'GET',
    path: `${path}/{id}`,
    config: {auth: 'jwt'},
    handler: async function (request) {
      const id = request.params.id;

      console.log('id', id);
      try {
        const model = await Model.find(id);
        return Response.success(name, model);
      } catch (ex) {
        console.log('get error', ex);
        return Response.badRequest(ex);
      }

    }
  };
};

module.exports = Get;
