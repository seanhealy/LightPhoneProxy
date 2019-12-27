const wiki = require("wikijs").default;

module.exports = function wikiHelper(term: string) {
  return wiki()
    .find(term)
    .then((page: any) => page.summary());
};
