import { wikiHelper } from "./helpers/wiki";
import config from "../config.json";

const lightHandle = config.lightNumber;

/*** Twilio ***/

import twilio from "twilio";

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

/*** Webhooks ***/

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/sms", (req, res) => {
  if (req.body.From === config.lightNumber) {
    const proxy = config.numberProxies.find(
      proxy => proxy.proxy === req.body.To
    );

    if (proxy) {
      imessage.send(proxy.real, req.body.Body);
    }
  } else {
    console.log("👤 Unknown Sender.");
  }

  res.send("<Response></Response>");
});

app.listen(port, () =>
  console.log(`🌐 Example app listening on port ${port}!`)
);

/*** iMessage ***/

import imessage from "osa-imessage";

console.log(`📬 Set up proxy to Light Phone at: ${lightHandle}`);

imessage.listen().on("message", message => {
  if (!message.fromMe) {
    if (message.handle === lightHandle) {
      helper("wiki", message.text, wikiHelper);
    } else {
      const proxy = config.numberProxies.find(
        proxy => proxy.real === message.handle
      );

      if (proxy) {
        client.messages.create({
          body: message.text,
          from: proxy.proxy,
          to: config.lightNumber
        });
      } else {
        imessage.nameForHandle(message.handle).then(name => {
          client.messages.create({
            body: `↓ ${name}: ${message.text}`,
            from: config.controlNumber,
            to: config.lightNumber
          });
        });
      }
    }
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
