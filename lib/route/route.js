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
    this.pre = route.pre && route.pre();
    const Model = this.getModel();

    const postOptions = {
      path: this.config.route,
      name: this.config.name,
      Model: Model,
      validate: this.validate,
      beforeCreate: this.modelHooks.beforeCreate,
      pre: this.pre,
    };


    this.plugin = {
      name: this.config.name,
      register: async (server, options) => {
        await server.route(require('./methods/post')(postOptions));
        await server.route(require('./methods/get')(this.config.route, this.config.name, Model, this.validate, this.modelHooks.beforeRead));
        await server.route(require('./methods/put')(this.config.route, this.config.name, Model, this.validate, this.modelHooks.beforeUpdate));
        await server.route(require('./methods/query')(this.config.route, this.config.name, Model, this.validate, this.modelHooks.beforeQuery));
        await server.route(require('./methods/delete')(this.config.route, this.config.name, Model, this.validate, this.modelHooks.beforeDelete));
      },
    };
  }


  getModel() {
    const mf = new ModelFactory(this.config, this.modelExtension, this.modelEvents);
    return mf.generate();
  }
}

module.exports = Plugin;
