console.log('\x1b[31mStarting Crypto Tracker...\x1b[0m\n')

const fs = require('fs')
require('dotenv').config()

//CONFIG
const config = require('./config.js')


//PREPARING THE CLIENT'S LISTENERS
console.log('\x1b[32mLoading listeners...\x1b[0m')
let listeners = fs.readdirSync('./app/listeners').filter(file => file.endsWith('.js'));
for(let listener of listeners) {
    let listenerFile = require(`./listeners/${listener}`)
    listenerFile(config.client)
    console.log(`\x1b[33mLoaded listener:\x1b[37m ${listener}\x1b[0m`)
}

console.log("\x1b[32mListeners loaded.\x1b[0m\n");

//LOGGIN DISCORD BOT
config.client.login(process.env.CLIENT_TOKEN)