const Bottle = require('bottlejs');

const Container = {};
const bottle = new Bottle();
// const

Container.seed = (connection, debug) => {
  const knex = require('./knexConfig')(connection, debug);
  const bookshelf = require('./connection')(knex);
  Object.assign(bookshelf, {$name: 'bookshelf', $type: 'value'});
  bottle.register(bookshelf);
};


Container.get = () => {
  // const bottle = new Bottle();
  return bottle.container.bookshelf;
};

module.exports = Container;
