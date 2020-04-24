process.env["NTBA_FIX_319"] = 1;

const TelegramBot = require("node-telegram-bot-api");
const https = require("https");

require("dotenv").config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let coinPrice = "";

// koers command
bot.onText(/\/info (.+)/, (msg, match) => {
  const koers = match[1];
  https
    .get(`https://api.bitladon.com/market/${koers}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        let name = JSON.parse(body).result.name;
        let ticker = JSON.parse(body).result.ticker;
        let buy = JSON.parse(body).result.buyfinal;
        let sell = JSON.parse(body).result.sellfinal;
        let change24h = JSON.parse(body).result.change24h;
        let change72h = JSON.parse(body).result.change72h;
        coinPrice = `${name} (${ticker}) prijsinfo: \n\nKopen: €${buy} \nVerkopen: €${sell} \n24 uur verschil: ${change24h}% \n72 uur verschil: ${change72h}% \n\nKoop je ${name} eenvoudig en snel, op https://www.bitcoinmeester.nl/${name}`;
        bot.sendMessage(msg.chat.id, coinPrice);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

bot.onText(/\/koop (.+)/, (msg, match) => {
  const koers = match[1];
  https
    .get(`https://api.bitladon.com/market/${koers}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        let name = JSON.parse(body).result.name;
        let ticker = JSON.parse(body).result.ticker;
        let buy = JSON.parse(body).result.buyfinal;
        koopPrice = `De huidige koopprijs van ${name} (${ticker}) bij Bitcoin Meester is: €${buy}`;
        bot.sendMessage(msg.chat.id, koopPrice);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

bot.onText(/\/verkoop (.+)/, (msg, match) => {
  const koers = match[1];
  https
    .get(`https://api.bitladon.com/market/${koers}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        let name = JSON.parse(body).result.name;
        let ticker = JSON.parse(body).result.ticker;
        let sell = JSON.parse(body).result.sellfinal;
        verkoopPrice = `De huidige verkoopprijs van ${name} (${ticker}) bij Bitcoin Meester is: €${sell}`;
        bot.sendMessage(msg.chat.id, verkoopPrice);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

// command - /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome");
});

// command - /admins
bot.onText(/\/admins/, (msg) => {
  bot.sendMessage(msg.chat.id, "@Dutch_christiaan, @rmeijams, @Martijnnnnn");
});

// command - /regels
bot.onText(/\/regels/, (msg) => {
  bot.sendMessage(msg.chat.id, "Niet shillen");
});

// command /socials
bot.onText(/\/socials/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Twitter: https://twitter.com/bitcoin_meester \nFacebook: https://www.facebook.com/bitcoinmeester \nInstagram: https://www.instagram.com/bitcoinmeester/ \nBlog: https://nieuws.bitcoinmeester.nl/"
  );
});

// command /blog
bot.onText(/\/blog/, (msg) => {
  bot.sendMessage(msg.chat.id, "https://nieuws.bitcoinmeester.nl/");
});

// command nieuws
bot.onText(/\/nieuws/, (msg) => {
  bot.sendMessage(msg.chat.id, "https://nieuws.bitcoinmeester.nl/");
});

// command /shop
bot.onText(/\/shop/, (msg) => {
  bot.sendMessage(msg.chat.id, "https://bitcoinmeester.shop/");
});
