require('dotenv').config()
const { Client, GatewayIntentBits, Partials, WebhookClient } = require('discord.js');
const CryptoAPI = require('coingecko-api');

module.exports = {
    //DISCORD CLIENT
    client: new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel]}),

    //CRYPTO API CLIENT
    cryptoClient: new CryptoAPI(),

    //INTERVAL DELAY TIME FOR UPDATING THE CRYPTO PRICES
    repeaterInterval: 300000, //to ms, 1000ms = 1s

    //CRYPTO COINS
    cryproCoins: [
        {
            bigName: 'bitcoin',
            shortName: 'BTC',
        }, 
        {
            bigName: 'ethereum',
            shortName: 'ETH',
        },
        //IF YOU WANT TO ADD MORE COINS, COPY THE OBJECT ABOVE AND PASTE IT BELOW
        //TWO MORE COLLUMS NEED TO BE ADDED TO THE DATABASE "{shortName}_ChannelPriceID" AND "{shortName}_ChannelChangeID"
    ]
}