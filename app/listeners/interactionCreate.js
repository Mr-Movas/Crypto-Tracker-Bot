const interactionCreate = require('../events/interactionCreate.js')

module.exports = (client) => {
    client.on('interactionCreate', interactionCreate)
}