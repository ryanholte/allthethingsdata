module.exports = (knex) => {
  const Bookshelf = require('bookshelf')(knex);
  Bookshelf.plugin('registry');
  Bookshelf.plugin('virtuals');
  return Bookshelf;
};

