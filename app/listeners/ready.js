const fs = require('fs')
const config = require('../config.js')
const { refreshGuildsDB, getTotalSimulatorChannels, refreshAccounts } = require('../database/database.js');
const repeater = require('./repeater/repeater.js')
const log = require('../logs/log.js')
const refreshCActivity = require('../functions/refreshActivity.js')

module.exports = async () => {

    //POST THE SLASH COMMANDS
    console.log('Posting slash commands.')
    let commands = [];
    let commandFiles = fs.readdirSync('./app/slashcommands').filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
        let command = require(`../slashcommands/${file}`);
        commands.push(command)
    }
    await config.client.application.commands.set(commands)
    
    //ADD ANY MISSING GUILDS TO THE DATABASE
    //REMOVE ANY EXTRA GUILDS FROM THE DATABASE
    console.log('Checking for any missing or extra guild.');
    let guilds = await refreshGuildsDB(config.client)
    log('info', `Added ${guilds.added} missing guilds and removed ${guilds.removed} guilds.`)
    console.log(`Added ${guilds.added} missing guilds and removed ${guilds.removed} guilds.`)
    
    //START THE REPEATER
    repeater()

    //SET ACTIVITY
    refreshCActivity()

    console.log(`Logged in as ${config.client.user.tag}!`);
    log('info', `Logged in as ${config.client.user.tag}!`)
    
}