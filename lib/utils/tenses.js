const Lingo = require('lingo').en;

class Tenses {
  static getSingular(word) {
    return Lingo.isPlural(word) ? Lingo.singularize(word) : word;
  }
}

module.exports = Tenses;
