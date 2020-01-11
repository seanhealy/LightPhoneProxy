export function pingHelper(term: string) {
  console.log(`Received Ping at ${Date.now()}`);
  return Promise.resolve("pong");
}
