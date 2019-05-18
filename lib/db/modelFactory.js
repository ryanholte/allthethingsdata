const BaseModel = require('./baseModel');
const Bottle = require('bottlejs');
const bottle = new Bottle();
const _ = require('lodash');

class ModelFactory {
  constructor(config, modelExtension, modelEvents, stripColumns) {
    this.config = config;
    this.modelExtension = modelExtension;
    this.modelEvents = modelEvents && modelEvents();
    const db = require('./index');
    this.bookshelf = db.get();
    this.stripCols = stripColumns;
  }

  model() {
    return bottle.container[this.config.name];
  }

  stripColumns() {
    if (this.stripCols && this.stripCols.length && !_.isEmpty(this.attributes)) {
      this.attributes = _.omit(this.attributes, this.stripCols);
    }
    return this;
  }

  generate() {
    const self = this;

    const defaultModel = {
      tableName: this.config.table,
      constructor: function () {
        self.bookshelf.Model.apply(this, arguments);

        this.on('updating', (model, attrs, options) => {
          model.set('updated_at', Math.floor(Date.now() / 1000));
        });
        this.on('saving', (model, attrs, options) => {
          model.set('created_at', Math.floor(Date.now() / 1000));
        });

        if (self.modelEvents) {
          if (self.modelEvents.created) {
            this.on('created', self.modelEvents.created);
          }

          if (self.modelEvents.updated) {
            this.on('updated', self.modelEvents.updated);
          }

          if (self.modelEvents.saved) {
            this.on('saved', self.modelEvents.saved);
          }
        }
      }
    };

    const modelExtension = (this.modelExtension && this.modelExtension()) || {};

    const extraStaticOptions = {
      raw: this.bookshelf.knex.raw,
    };

    const extraInstanceOptions = {
      stripColumns: this.stripColumns,
      stripCols: this.stripCols,
    };

    const modelObj = Object.assign(defaultModel, modelExtension.instance, extraInstanceOptions);
    const modelObjStatic = Object.assign(BaseModel, modelExtension.static, extraStaticOptions);
    const model = this.bookshelf.Model.extend(modelObj, modelObjStatic);

    const m = this.bookshelf.model(this.config.name, model);

    const reg = Object.assign(m, {$name: this.config.name, $type: 'value'});
    bottle.register(reg);
    return m;
  }
}

module.exports = ModelFactory;
