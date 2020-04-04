// const plugin = {
//   plugin: async function (server, options) {
//     server.route(require('./get'));
//   }
// };

const ModelFactory = require('../db/modelFactory');
const Joi = require('@hapi/joi');

const getPre = (setting, valueDefault) => {
  const hapiDefault = [];
  if (setting !== undefined) {
    if (setting === false) {
      return hapiDefault;
    }
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

/**
 * stripes columns from the response
 * @param setting
 * @param valueDefault
 * @returns {Array|*}
 */
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

// const validateConfig = () => {
//   return Joi
// };


const validateRoute = (route) => {
  const {
    config,
    validate,
    modelExtension,
    events,
    hooks,
  } = route;

  const configSchema = Joi
    .object({
      route: Joi.string().label('config.route').required(),
      name: Joi.string().label('config.name').required(),
      table: Joi.string().label('config.table').required(),
    })
    .label('route config object')
    .required();


  const { error } = configSchema.validate(config());

  if (error) {
    throw new Error(error);
  }
};

class Plugin {
  constructor(route) {
    try {

      validateRoute(route);
      let i = 1;
      this.config = route.config();
      this.validate = route.validate;
      this.modelExtension = route.modelExtension;
      this.modelEvents = route.events;
      this.modelHooks = route.hooks && route.hooks() || {};
      this.pre = route.pre && route.pre() || [];
      this.omitRoutes = route.omitRoutes && route.omitRoutes() || [];
      this.auth = route.auth && route.auth() || {};
      this.stripColumns = route.stripColumns && route.stripColumns() || [];
      const Model = this.getModel();

      const routeDefaults = {
        path: this.config.route,
        name: this.config.name,
        Model: Model,
        validate: this.validate,
      };

      const postOptions = Object.assign({}, routeDefaults, {
        pre: getPre(this.pre.post, this.pre.default),
        auth: getAuth(this.auth.post, this.auth.default),
        beforeCreate: this.modelHooks.beforeCreate,
        beforeRead: this.modelHooks.beforeRead,
      });
      const getOptions = Object.assign({}, routeDefaults, {
        pre: getPre(this.pre.get, this.pre.default),
        auth: getAuth(this.auth.get, this.auth.default),
        beforeRead: this.modelHooks.beforeRead,
        afterRead: this.modelHooks.afterRead,
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
        beforeDelete: this.modelHooks.beforeDelete
      });


      this.plugin = {
        name: this.config.name,
        register: async (server, options) => {
          if (this.omitRoutes === 'all') {
            return;
          }

          if (!this.omitRoutes.includes('post')) {
            await server.route(require('./methods/post')(postOptions));
          }
          if (!this.omitRoutes.includes('get')) {
            await server.route(require('./methods/get')(getOptions));
          }

          if (!this.omitRoutes.includes('put')) {
            await server.route(require('./methods/put')(putOptions));
          }

          if (!this.omitRoutes.includes('query')) {
            await server.route(require('./methods/query')(queryOptions));
          }

          if (!this.omitRoutes.includes('delete')) {
            await server.route(require('./methods/delete')(deleteOptions));
          }
        },
      };
    } catch (err) {
      console.log(err);
    }
  }


  getModel() {
    const mf = new ModelFactory(this.config, this.modelExtension, this.modelEvents, getStripedColumns(this.stripColumns));
    return mf.generate();
  }
}

module.exports = Plugin;
