const guildDelete = require('../events/guildDelete.js')

module.exports = (client) => {
    client.on('guildDelete', guildDelete)
}