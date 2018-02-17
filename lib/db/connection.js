// const config = require('../config');

console.log('getting new connection');

let knex;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  console.log(`firing up ${process.env.NODE_ENV}!`);

  knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 10,
    },
    debug: String(process.env.SQL_DEBUG) === 'true' || true,
    ssl: true,
  });

} else {
  console.log('firing up local');

  knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: {
      host: "ec2-54-225-192-128.compute-1.amazonaws.com",
      user: "pjkyotgkoanief",
      password: "PZoet2UmmYNVLRb3zhkWOTit8N",
      database: "dak8ar7fgq0to9",
      charset: 'utf8',
      ssl: true
    },
  });
}
const Bookshelf = require('bookshelf')(knex);

//require('./schema')(Bookshelf.knex.schema);


Bookshelf.plugin('registry');
Bookshelf.plugin('virtuals');
//server.expose('bookshelf', Bookshelf);

module.exports = Bookshelf;
