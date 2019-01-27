// const plugin = {
//   plugin: async function (server, options) {
//     server.route(require('./get'));
//   }
// };

const ModelFactory = require('../db/modelFactory');

class Plugin {
  constructor(route) {
    this.config = route.config();
    this.validate = route.validate;
    this.modelExtension = route.modelExtension;
    this.modelEvents = route.events;
    this.modelHooks = route.hooks && route.hooks() || {};
    this.pre = route.pre && route.pre() || {};
    this.auth = route.auth && route.auth() || {};
    const Model = this.getModel();

    //asdf
    const routeDefaults = {
      path: this.config.route,
      name: this.config.name,
      Model: Model,
      validate: this.validate,
    };

    const postOptions = Object.assign({}, routeDefaults, {
      pre: this.pre.post,
      auth: this.auth.post || this.auth.default || false,
      beforeCreate: this.modelHooks.beforeCreate,
    });
    const getOptions = Object.assign({}, routeDefaults, {
      pre: this.pre.get,
      auth: (this.auth.get !== undefined) ? this.auth.get : this.auth.default,
      beforeRead: this.modelHooks.beforeRead
    });
    const putOptions = Object.assign({}, routeDefaults, {
      pre: this.pre.put,
      auth: this.auth.put || this.auth.default || false,
      beforeUpdate: this.modelHooks.beforeUpdate
    });
    const queryOptions = Object.assign({}, routeDefaults, {
      pre: this.pre.query,
      auth: this.auth.query || this.auth.default || false,
      beforeRead: this.modelHooks.beforeQuery,
    });
    const deleteOptions = Object.assign({}, routeDefaults, {
      pre: this.pre.delete,
      auth: this.auth.delete || this.auth.default || false,
      beforeDelte: this.modelHooks.beforeDelete
    });


    this.plugin = {
      name: this.config.name,
      register: async (server, options) => {
        await server.route(require('./methods/post')(postOptions));
        await server.route(require('./methods/get')(getOptions));
        await server.route(require('./methods/put')(putOptions));
        await server.route(require('./methods/query')(queryOptions));
        await server.route(require('./methods/delete')(deleteOptions));
      },
    };
  }


  getModel() {
    const mf = new ModelFactory(this.config, this.modelExtension, this.modelEvents);
    return mf.generate();
  }
}

module.exports = Plugin;
