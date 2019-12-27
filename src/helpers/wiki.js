const wiki = require("wikijs").default;

module.exports = function wikiHelper(term) {
  return wiki()
    .find(term)
    .then(page => page.summary());
};
