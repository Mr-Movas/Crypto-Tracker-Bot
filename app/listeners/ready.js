const ready = require('../events/ready.js')

module.exports = (client) => {
    client.on('ready', ready)
}