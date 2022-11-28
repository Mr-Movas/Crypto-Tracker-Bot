const database = require('../database/database.js')
const log = require('../logs/log.js')

module.exports = (guild) => {
    //LOG THE GUILD
    log('info', `Joined a new guild ${guild.name} (${guild.id})`)
    
    //ADD THE GUILD TO THE DATABASE
    database.addGuild(guild.id)
}