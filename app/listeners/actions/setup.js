const database = require('../../database/database.js')
const config = require('../../config.js')

module.exports = async (interaction) => {

    //RETURN IF BOT HAS NO PERMISSIONS TO SET UP THE CATEGORY
    if(!interaction.appPermissions.has('ManageChannels')) return interaction.editReply('I do not have the permission to manage channels')

    let totalChannelsThatFailed = 0

    //CREATE CATAGORY
    const category = await interaction.guild.channels.create({ 
        name: 'Crypto Tracker', 
        type: 4,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                allow: ['ViewChannel'],
                deny: ['Connect']
            },
        ],
    }).catch(err => {
        console.log(err)
        log('error', 'Error creating category: ' + err)
    })

    if(!category) return interaction.editReply('I could not create the category.').catch(err => {})

    //CREATE CHANNELS
    for(let coin of config.cryproCoins) {
        let coinData = await config.cryptoClient.coins.fetch(coin.bigName, {}).catch(err => console.log(err))

        //SAVE PRICE AND PERCENTAGE CHANGE
        //IF THE COIN IS NOT FOUND, SAVE -
        let price = coinData ? coinData.data.market_data.current_price.usd : '-'
        let percentageChange = coinData ? coinData.data.market_data.price_change_percentage_24h : '-'

        //PRICE CHANNEL
        const priceChannel = await interaction.guild.channels.create({ name: `${percentageChange > 0?'📈':'📉'} ${coin.shortName}: $${price}`, type: 2, parent: category }).catch(err => {totalChannelsThatFailed++})
        //PERCENTAGE CHANNEL
        const percentageChannel = await interaction.guild.channels.create({ name: `${percentageChange > 0?'📈':'📉'} ${coin.shortName}: ${percentageChange}%`, type: 2,parent: category }).catch(err => {totalChannelsThatFailed++})

        //ADD CHANNELS TO DATABASE
        await database.guildExists(interaction.guild.id);
        await database.query(`
            UPDATE guilds SET
            ${coin.shortName}_ChannelPriceID = '${priceChannel ? priceChannel.id : ""}',
            ${coin.shortName}_ChannelChangeID = '${percentageChannel ? percentageChannel.id : ""}'
            WHERE guildID = '${interaction.guild.id}'
        `).catch(err => console.log(err))
    }

    //RETURN IF AT LEAST ONE CHANNEL FAILED TO CREAETE
    if(totalChannelsThatFailed > 0) return interaction.editReply(`I couldn't create all the channels.`)
    
    interaction.editReply('Category and channels have been created.').catch(err => {})

}