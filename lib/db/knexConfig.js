module.exports = (connection, debug = false) => {
  let knex;

  console.log('Getting a new connection');

  if (typeof connection === 'string') {
    knex = require('knex')({
      client: 'pg',
      connection,
      pool: {
        min: 1,
        max: 10,
      },
      debug: debug,
      ssl: true,
    });

  } else {
    knex = require('knex')({
      client: 'pg',
      debug: debug,
      connection,
    });
  }
  return knex;
};
