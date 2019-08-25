const Response = require('../response');

function Get(options) {
  const {
    path,
    name,
    Model,
    validate,
    beforeCreate,
    beforeRead,
    afterRead,
    pre = [],
    auth,
    strippedColumns,
  } = options;
  return {
    method: 'GET',
    path: `${path}/{id}`,
    config: {
      pre,
      auth,
      handler: async function (request) {
        const id = request.params.id;
        try {
          const query = await Model.find(id, false);
          if (beforeRead) {
            const valid = await beforeRead('get', request, query);
          }

          let fetchOptions = undefined;
          const relations = query.customRelations;
          if (relations) {
            fetchOptions = {
              withRelated: relations
            };
          }

          let model = await query.fetch(fetchOptions);
          if (afterRead) {
            model = afterRead(model);
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

module.exports = Get;
