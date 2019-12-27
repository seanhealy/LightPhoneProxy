const imessage = require("osa-imessage");

const lightHandle = process.argv[2];

if (lightHandle) {
  console.log(`📬 Set up proxy to Light Phone at: ${lightHandle}`);
} else {
  console.log(`⚠️  Light Phone number required.`);
  console.log(`   Please run \`npm start -- [LIGHT PHONE NUMBER]\`.`);
  console.log(`   eg. \`npm run -- +12229997777\``);
  process.exit(1);
}

imessage.listen().on("message", message => {
  if (message.handle === lightHandle) {
    if (!message.fromMe) {
      helper("wiki", message.text, require("./helpers/wiki"));
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
