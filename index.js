process.env["NTBA_FIX_319"] = 1;
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const https = require("https");
const cron = require("node-cron");

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let coinPrice = "";
let buyPrice = "";
let sellPrice = "";
let morningUpdate = "";

// Ochtend update
bot.onText(/\/start/, (msg) => {
  console.log("timer running");
  cron.schedule("0 * * * *", () => {
    https
      .get(`https://api.bitladon.com/market/btc`, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          let buy = JSON.parse(body).result.buyfinal;
          let change24h = JSON.parse(body).result.change24h;
          if (change24h > 0 && change24h < 5) {
            morningUpdate = `Good morning Bitladon members! The current Bitcoin (BTC) buy price at Bitladon is: €${buy} \nThis is a change of ${change24h}% in the last 24 hours!\nEnjoy your day!`;
          } else if (change24h > 5) {
            morningUpdate = `Good morning Bitladon members! The current Bitcoin (BTC) buy price at Bitladon is: €${buy} \nThis is a change of ${change24h}% in the last 24 hours!🤩🚀🚀\nEnjoy your day!`;
            bot.sendMessage(msg.chat.id, morningUpdate);
          } else {
            morningUpdate = `Good morning Bitladon members! The current Bitcoin (BTC) buy price at Bitladon is: €${buy} \nThis is a change of ${change24h}% in the last 24 hours...😐\nEnjoy your day!`;
            bot.sendMessage(msg.chat.id, morningUpdate);
          }
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  });
});

// info zonder ticker

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Don't forget to include the ticker! try /info btc"
  );
});

// info met ticker command
bot.onText(/\/info (.+)/, (msg, match) => {
  const ticker = match[1];
  https
    .get(`https://api.bitladon.com/market/${ticker}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (JSON.parse(body).error == false) {
          let name = JSON.parse(body).result.name;
          let ticker = JSON.parse(body).result.ticker;
          let buy = JSON.parse(body).result.buyfinal;
          let sell = JSON.parse(body).result.sellfinal;
          let change24h = JSON.parse(body).result.change24h;
          let change72h = JSON.parse(body).result.change72h;

          coinPrice = `${name} (${ticker}) price info: \n\nBuy: €${buy} \nSell: €${sell} \n24 hour change: ${change24h}% \n72 hour change: ${change72h}% \n\nBuy your ${name} secure, fast and easy at https://www.bitladon.com/${name}`;
          bot.sendMessage(msg.chat.id, coinPrice);
        } else {
          bot.sendMessage(
            msg.chat.id,
            "Hmmm... It looks like we don't offer that coin (yet)... \nBe sure to include the ticker of the coin when you ask for info!"
          );
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

bot.onText(/\/buy (.+)/, (msg, match) => {
  const ticker = match[1];
  https
    .get(`https://api.bitladon.com/market/${ticker}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (JSON.parse(body).error == false) {
          let name = JSON.parse(body).result.name;
          let ticker = JSON.parse(body).result.ticker;
          let buy = JSON.parse(body).result.buyfinal;
          buyPrice = `The current ${name} (${ticker}) buy price at Bitladon is: €${buy}`;
          bot.sendMessage(msg.chat.id, buyPrice);
        } else {
          bot.sendMessage(
            msg.chat.id,
            "Hmmm... It looks like we don't offer that coin (yet)... \nBe sure to include the ticker of the coin when you ask for info!"
          );
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

bot.onText(/\/sell (.+)/, (msg, match) => {
  const ticker = match[1];
  https
    .get(`https://api.bitladon.com/market/${ticker}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (JSON.parse(body).error == false) {
          let name = JSON.parse(body).result.name;
          let ticker = JSON.parse(body).result.ticker;
          let sell = JSON.parse(body).result.sellfinal;
          sellPrice = `The current sellprice of ${name} (${ticker}) at Bitladon is: €${sell}`;
          bot.sendMessage(msg.chat.id, sellPrice);
        } else {
          bot.sendMessage(
            msg.chat.id,
            "Hmmm... It looks like we don't offer that coin (yet)... \nBe sure to include the ticker of the coin when you ask for info!"
          );
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "/info ticker - Price info of a coin \n \n/buy ticker - Current buy price of a coin \n \n/sell - Current sell price of a coin \n \n/admins - Overview of the admins of this channel\n \n/socials - Overview of the social media channels of Bitladon"
  );
});

// /admins
bot.onText(/\/admins/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "@boyd56 - The Boss😎 \n\n@mjz1234 - The Boss😎 \n\n@Dutch_christiaan - Marketing Manager🤓\n\n@rmeijams - Online Marketing/Content⌨️\n\n@Martijnnnnn - Online Marketing💻\n\n @Maxime217 - Support📞"
  );
});

// command /socials
bot.onText(/\/socials/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Twitter - https://twitter.com/bitladon \n\nFacebook - https://www.facebook.com/bitladoncom \n\nInstagram - https://www.instagram.com/bitcoinmeester/ \n\nMedium.com - https://medium.com/@bitladon.com"
  );
});
