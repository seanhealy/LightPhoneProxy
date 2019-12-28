import wiki from "wikijs";

export function wikiHelper(term: string) {
  return wiki()
    .find(term)
    .then(page => page.summary());
}
