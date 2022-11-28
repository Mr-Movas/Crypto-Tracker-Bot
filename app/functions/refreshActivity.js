const config = require('../config.js')
const log = require('../logs/log.js')

module.exports = async () => {
    let btcData = await config.cryptoClient.coins.fetch('bitcoin', {})
        .catch(err => {
            console.log(err)
            log('error', `Error fetching ${coin.bigName} to update bot activity data: ${err}`)
        })

    if(!btcData) return;

    let price = btcData.data.market_data.current_price.usd
    let percentageChange = btcData.data.market_data.price_change_percentage_24h

    log('info', `Updating bot activity to ${percentageChange > 0?'📈':'📉'} BTC: $${price.toFixed(2)} (${percentageChange.toFixed(3)}%)`)

    config.client.user.setActivity(`${percentageChange > 0?'📈':'📉'} BTC: $${price.toFixed(2)} | ${percentageChange.toFixed(3)}%`, { type: 3 })
}