const database = require('../database/database.js')
const log = require('../logs/log.js')

module.exports = (guild) => {
    //LOG THE GUILD
    log('info', `Left from a guild ${guild.name} (${guild.id})`)
    
    //REMOVE THE GUILD FROM THE DATABASE
    database.removeGuild(guild.id)
}