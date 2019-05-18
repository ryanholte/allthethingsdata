// const plugin = {
//   plugin: async function (server, options) {
//     server.route(require('./get'));
//   }
// };

const ModelFactory = require('../db/modelFactory');

const getPre = (setting, valueDefault) => {
  const hapiDefault = [];
  if (setting !== undefined) {
    return setting;
  }

  if (valueDefault !== undefined) {
    return valueDefault;
  }

  return hapiDefault;
};

const getAuth = (setting, valueDefault) => {
  const hapiDefault = false;
  if (setting !== undefined) {
    return setting;
  }

  if (valueDefault !== undefined) {
    return valueDefault;
  }

  return hapiDefault;
};

const getStripedColumns = (setting, valueDefault) => {
  const theDefault = [];
  if (setting !== undefined) {
    return setting;
  }

  if (valueDefault !== undefined) {
    return valueDefault;
  }

  return theDefault;
};

class Plugin {
  constructor(route) {
    this.config = route.config();
    this.validate = route.validate;
    this.modelExtension = route.modelExtension;
    this.modelEvents = route.events;
    this.modelHooks = route.hooks && route.hooks() || {};
    this.pre = route.pre && route.pre() || {};
    this.auth = route.auth && route.auth() || {};
    this.stripColumns = route.stripColumns && route.stripColumns() || [];
    const Model = this.getModel();

    const routeDefaults = {
      path: this.config.route,
      name: this.config.name,
      strippedColumns: getStripedColumns(this.stripColumns),
      Model: Model,
      validate: this.validate,
    };

    const postOptions = Object.assign({}, routeDefaults, {
      pre: getPre(this.pre.post, this.pre.default),
      auth: getAuth(this.auth.post, this.auth.default),
      beforeCreate: this.modelHooks.beforeCreate,
    });
    const getOptions = Object.assign({}, routeDefaults, {
      pre: getPre(this.pre.get, this.pre.default),
      auth: getAuth(this.auth.get, this.auth.default),
      beforeRead: this.modelHooks.beforeRead
    });
    const putOptions = Object.assign({}, routeDefaults, {
      pre: getPre(this.pre.put, this.pre.default),
      auth: getAuth(this.auth.put, this.auth.default),
      beforeUpdate: this.modelHooks.beforeUpdate
    });
    const queryOptions = Object.assign({}, routeDefaults, {
      pre: getPre(this.pre.query, this.pre.default),
      auth: getAuth(this.auth.query, this.auth.default),
      beforeRead: this.modelHooks.beforeQuery,
    });
    const deleteOptions = Object.assign({}, routeDefaults, {
      pre: getPre(this.pre.delete, this.pre.default),
      auth: getAuth(this.auth.delete, this.auth.default),
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
    const mf = new ModelFactory(this.config, this.modelExtension, this.modelEvents, getStripedColumns(this.stripColumns));
    return mf.generate();
  }
}

module.exports = Plugin;
