const BaseModel = require('./baseModel');
const Bookshelf = require('./connection');

class ModelFactory {
  constructor(config) {
    this.config = config;
  }

  generate() {
    const model = Bookshelf.Model.extend({
      tableName: this.config.table,
    }, BaseModel);

    return Bookshelf.model(this.config.name, model);
  }
}

module.exports = ModelFactory;
