class RouteInterface {
  constructor() {
    if (!this.config) {
      this.throwError('Must define config!');
    }

    const config = this.config();
    if (typeof config !== 'object') {
      this.throwError('Config Must Be an Object');
    }

    if (!config.route) {
      this.throwError('Config Must Define Route');
    }

    if (!config.name) {
      this.throwError('Config Must Define Name');
    }

    if (!this.validate) {
      this.throwError('You must implement a validate function');
    }
  }

  throwError(msg) {
    throw new Error(msg);
  }
}

module.exports = RouteInterface;
