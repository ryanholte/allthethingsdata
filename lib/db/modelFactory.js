const BaseModel = require('./baseModel');
const Bottle = require('bottlejs');
const bottle = new Bottle();

class ModelFactory {
  constructor(config, modelExtension) {
    this.config = config;
    this.modelExtension = modelExtension;
    const db = require('./index');
    this.bookshelf = db.get();
  }

  model() {
    return bottle.container[this.config.name];
  }

  generate() {
    const defaultModel = {
      tableName: this.config.table,
    };

    const modelExtension = (this.modelExtension && this.modelExtension()) || {};

    const modelObj = Object.assign(defaultModel, modelExtension);
    const model = this.bookshelf.Model.extend(modelObj, BaseModel);

    const m = this.bookshelf.model(this.config.name, model);
    const reg = Object.assign(m, {$name: this.config.name, $type: 'value'});
    bottle.register(reg);
    return m;
  }
}

module.exports = ModelFactory;
