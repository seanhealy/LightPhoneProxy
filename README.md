# LightPhoneProxy

A Simple SMS and iMessage Proxy for the Light Phone 2.

## What is LightPhoneProxy?

The intention of LightPhoneProxy is to proxy messaging from a LightPhone so that others will continue to see messages as though you are sending them from your main iPhone line. It will respond via iMessage or SMS based on the last message received from a configured contact.

Any contact that is not configured will have their message forwared to you through a common number. Currently there is no way to respond to these contacts but, I'm picturing that a simple `r jane message` type syntax could allow for communication with less common contacts.

## Getting Started

LightPhoneProxy requires [NodeJS](https://nodejs.org/en/) to be installed.

You can either start it from the terminal with `npm start`.

> **Note:** You must [grant _Full Disk Access_ to Terminal](http://osxdaily.com/2018/10/09/fix-operation-not-permitted-terminal-error-macos/). This is required in order to subscribe to messages.

LightPhoneProxy also currently requires a Twilio account with a _proxy_ number for each contact you wish to converse with setup in `config.json`. There is no reason why [many people couldn't share these proxy numbers](https://github.com/seanhealy/LightPhoneProxy/issues/1) so I'm planning on figuring that restriction out as with more people using it the phone number cost per user would be lower.

Twilio also currently requires the use of webhooks so you will either need to open a port through your router or use a tool like [ngrok](https://ngrok.com). There is a script setup to simplify the launching of ngrok `npm run tunnel -- -subdomain=[your subdomain]`.

## Contributing

Please open an issue if you have any ideas. I'd like to get this to the point where it could be a simple application.
