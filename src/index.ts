import imessage from "osa-imessage";
import { wikiHelper } from "./helpers/wiki";
import config from "../config.json";

const lightHandle = config.lightNumber;

console.log(`📬 Set up proxy to Light Phone at: ${lightHandle}`);

imessage.listen().on("message", message => {
  if (message.handle === lightHandle) {
    if (!message.fromMe) {
      helper("wiki", message.text, wikiHelper);
    }
  } else {
    imessage.nameForHandle(message.handle).then(name => {
      const direction = message.fromMe ? "↑" : "↓";
      sendToLightphone(`${direction} ${name}: ${message.text}`);
    });
  }
});

function sendToLightphone(message: string) {
  console.log(`🚀 ${message}`);
  imessage.send(lightHandle, message);
}

function helper(
  trigger: string,
  message: string,
  helper: (message: string) => Promise<string>
) {
  if (message.toLowerCase().startsWith(trigger)) {
    const args = message.slice(trigger.length).trim();
    helper(args).then(sendToLightphone);
  }
}
