import { wikiHelper } from "./helpers/wiki";
import config from "../config.json";

const lightHandle = config.lightNumber;
const handlesService = {};

/*** Twilio ***/

import twilio from "twilio";

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

async function redactedSend(to: string, from: string, text: string) {
  const sent = await client.messages.create({
    to,
    from,
    body: text
  });

  redactMessage(sent.sid);
}

function redactMessage(messageSid: string) {
  client
    .messages(messageSid)
    .fetch()
    .then(message => {
      if (["delivered", "received"].includes(message.status)) {
        client
          .messages(messageSid)
          .update({ body: "" })
          .then(() => {})
          .catch(err => console.error(err));
      } else {
        setTimeout(() => redactMessage(messageSid), 500);
      }
    })
    .catch(err => console.error(err));
}

/*** Webhooks ***/

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  res.send("<Response></Response>");
  redactMessage(req.body.MessageSid);

  if (req.body.From === config.lightNumber) {
    const proxy = config.numberProxies.find(
      proxy => proxy.proxy === req.body.To
    );

    if (proxy) {
      imessage.send(proxy.real, req.body.Body, handlesService[proxy.real]);
    }
  } else {
    console.log("👤 Unknown Sender.");
  }
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

      if (config.ignoreMessagesFrom.includes(message.handle)) {
        return;
      }

      if (proxy) {
        handlesService[message.handle] = message.service;
        redactedSend(config.lightNumber, proxy.proxy, message.text);
      } else {
        imessage.nameForHandle(message.handle).then(name => {
          redactedSend(
            config.lightNumber,
            config.controlNumber,
            `↓ ${name}: ${message.text}`
          );
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
