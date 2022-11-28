const guildCreate = require('../events/guildCreate.js')

module.exports = (client) => {
    client.on('guildCreate', guildCreate)
}