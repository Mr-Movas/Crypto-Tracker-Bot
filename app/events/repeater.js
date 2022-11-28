const config = require('../config.js')
const database = require('../database/database.js')
const log = require('../logs/log.js')
const refreshCActivity = require('./function/refreshActivity.js')

//DELAY FUNCTION
async function delay(ms) {
    return new Promise(resolve => setTimeout(() => {resolve()}, ms));
}

//REFRESH THE CHANNELS FUNCTION 
async function refreshChannels() {

    log('info', 'Refreshing all voice channels.')

    for(let coin of config.cryproCoins) {

        //FETCH THE COIN PRICE AND PERCENTAGE CHANGE
        let coinData = await config.cryptoClient.coins.fetch(coin.bigName, {})
            .catch(err => {
                console.log(err)
                log('error', `Error fetching ${coin.bigName} data: ${err}`)
            })

        //IF THE COIN IS NOT FOUND, SKIP IT
        if(!coinData) continue;

        let price = coinData.data.market_data.current_price.usd
        let percentageChange = coinData.data.market_data.price_change_percentage_24h

        //GET ALL THE CHANNELS FOR THE COIN
        let channels = await database.getAllChannelsForCoin(coin.shortName)
            .catch(err => {
                console.log(err)
                log('error', `Error fetching ${coin.shortName} channels: ${err}`)
            })

        //IF THERE ARE NO CHANNELS, CONTINUE
        if(!channels) continue;

        //RENAME THE CHANNELS WITH THE NEW PRICE AND PERCENTAGE CHANGE
        for(let channel of channels) {

            //GET THE PRICE CHANNEL, IF NOT FOUND FETCH THE CHANNEL
            let priceChannel = config.client.channels.cache.get(channel[`${coin.shortName}_ChannelPriceID`])
            if(!priceChannel) config.client.channels.fetch(channel[`${coin.shortName}_ChannelPriceID`]).catch(err => {log('error', `Error fetching ${coin.shortName} price channel with id ${channel[`${coin.shortName}_ChannelPriceID`]}: ${err}`)})

            //GET THE CHANGE CHANNEL, IF NOT FOUND FETCH THE CHANNEL
            let changeChannel = config.client.channels.cache.get(channel[`${coin.shortName}_ChannelChangeID`])
            if(!changeChannel) config.client.channels.fetch(channel[`${coin.shortName}_ChannelChangeID`]).catch(err => {log('error', `Error fetching ${coin.shortName} change channel with id ${channel[`${coin.shortName}_ChannelChangeID`]}: ${err}`)})

            //IF CHANNELS ARE FOUND RENAME THEM
            if(priceChannel) priceChannel.setName(`${percentageChange > 0?'📈':'📉'} ${coin.shortName}: $${price.toFixed(2)}`).catch(err => {log('error', `Error renaming ${coin.shortName} price channel with id ${channel[`${coin.shortName}_ChannelPriceID`]}: ${err}`)})
            if(changeChannel) changeChannel.setName(`${percentageChange > 0?'📈':'📉'} ${coin.shortName}: ${percentageChange.toFixed(3)}%`).catch(err => {log('error', `Error renaming ${coin.shortName} change channel with id ${channel[`${coin.shortName}_ChannelChangeID`]}: ${err}`)})
        }

        //DELAYING TO AVOID DISCORD API LIMITS
        await delay(2000)

    }

    //REFRESHING ACTIVITY
    refreshCActivity()
} 


module.exports = () => {
    //REFRESH THE CHANNELS EVERY repeaterInterval SECONDS
    refreshChannels()

    //REFRESH THE CHANNELS EVERY repeaterInterval SECONDS
    setInterval(async () => {
        refreshChannels()
    }, config.repeaterInterval)
}