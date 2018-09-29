module.exports = {
  route: require('./lib/route'),
  io: require('./lib/io'),
  db: require('./lib/db/index'),
  setup(connection, debug) {
    require('./lib/db/index').seed(connection, debug);
  }
};
