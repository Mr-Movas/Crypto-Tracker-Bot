const log = require('../logs/log.js')
const help = require('./actions/help.js')
const setup = require('./actions/setup.js')


module.exports = async (interaction) => {

    //RETURN IF NOT A COMMAND
    if (!interaction.isCommand()) return;

    //DEFER REPLY
    await interaction.deferReply({ ephemeral: true }).catch(err => {})

    //HELP COMMAND
    if (interaction.commandName === 'help') {
        log('info', `Help command used by ${interaction.user.username} (${interaction.user.id})`)    
        help(interaction)
    }
    
    //SETUP COMMAND
    else if (interaction.commandName === 'setup') {
        log('info', `Setup command used by ${interaction.user.username} (${interaction.user.id})`)
        setup(interaction)
    }

}