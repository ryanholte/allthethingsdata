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
    const Model = this.getModel();

    this.plugin = {
      name: this.config.name,
      register: async (server, options) => {
        await server.route(require('./methods/post')(this.config.route, this.config.name, Model, route.validate));
        await server.route(require('./methods/get')(this.config.route, this.config.name, Model, route.validate));
        await server.route(require('./methods/put')(this.config.route, this.config.name, Model, route.validate));
        await server.route(require('./methods/delete')(this.config.route, this.config.name, Model));
      },
    };
  }


  getModel() {
    const mf = new ModelFactory(this.config);
    return mf.generate();
  }
}

module.exports = Plugin;
