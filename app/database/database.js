require('dotenv').config()
const config = require('../config.js')
const mysql = require('mysql2')

//CREATE CONNECTION
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

//QUERY FUNCTION
function query(query) {
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) reject(err);
            resolve(result)
        })
    })
} 

//SET INACTIVE TIME TO 25 HOURS
query('SET wait_timeout=90000')

//PRINT THAT DATABASE IS CONNECTED
console.log('[\x1b[36mDatabase\x1b[0m] \x1b[33mwas connected succesfully\x1b[0m')

module.exports = {
    query: query,

    //THIS IS A FUNCTION USED TO INSERT OR REMOVE ANY MISSING GUILDS FROM THE DATABASE
    refreshGuildsDB: async () => {
        return new Promise(async (resolve, reject) => {

            let guilds = {
                added: 0,
                removed: 0
            }

            //GET ALL THE GUILDS THE BOT IS IN
            //MAP THROUGH THEM AND CHECK IF THEY ARE IN THE DATABASE
            //IF THEY ARE NOT, INSERT THEM
            config.client.guilds.cache.map(async guild => {
                
                //CHECK IF THE GUILD IS IN THE DATABASE
                let result = await query(`SELECT guildID FROM guilds WHERE guildID = "${guild.id}"`).catch(err => reject(err))
                
                //IF THE GUILD IS NOT IN THE DATABASE, INSERT IT
                if(result.length == 0) {
                    await query(`
                        INSERT INTO guilds VALUES (
                            "${guild.id}",
                            "",
                            "",
                            "",
                            "",
                            0
                        )
                    `)
                    guilds.added++
                }
            })


            //GET ALL THE GUILDS IN THE DATABASE
            //MAP THROUGH THEM AND CHECK IF THEY ARE IN THE BOT
            //IF THEY ARE NOT, REMOVE THEM
            let result = await query(`SELECT guildID FROM guilds`).catch(err => reject(err))
            result.forEach(async guild => {
                    
                //CHECK IF THE GUILD IS IN THE BOT
                let guildInBot = config.client.guilds.cache.get(guild.guildID)

                //IF THE GUILD IS NOT IN THE BOT, REMOVE IT
                if(!guildInBot) {
                    await query(`DELETE FROM guilds WHERE guildID = "${guild.guildID}"`)
                    guilds.removed++
                }

            })


            //RETURN THE NUMBER OF GUILDS ADDED AND REMOVED
            resolve(guilds)

        });
    },




    //GET THE MESSAGE TO SEND THE NEW PRICE ALERT
    //coin can only be btc, eth, doge or sol
    getAllChannelsForCoin: async (coin) => {
        return new Promise(async (resolve, reject) => {
            
            coin = coin.toUpperCase();

            //CHECK IF THE COIN IS VALID
            if(coin != 'BTC' && coin != 'ETH' && coin != 'DOGE' && coin != 'SOL') reject('Coin must be "BTC", "ETH", "DOGE" or "SOL"');

            //GET ALL THE CHANNEL & MESSAGES FOR ALL THE ACTIVE CHANNELS
            let result = await query(`SELECT ${coin}_ChannelPriceID, ${coin}_ChannelChangeID FROM guilds WHERE ${coin}_ChannelPriceID <> ""`).catch(err => reject(err))

            //RETURN THE RESULT
            resolve(result)

        })
    },




    //ADD A NEW GUILD TO THE DATABASE
    addGuild: async (guildID) => {

        //CHECK IF THE GUILD IS ALREADY IN THE DATABASE
        let result = await query(`SELECT guildID FROM guilds WHERE guildID = "${guildID}"`).catch(err => {})
        if(result.length != 0) return

        //INSERT THE GUILD INTO THE DATABASE
        await query(`
            INSERT INTO guilds VALUES (
                "${guildID}",
                "",
                "",
                "",
                "",
                0
            )
        `).catch(err => {})

    },




    //REMOVE A GUILD FROM THE DATABASE
    removeGuild: async (guildID) => {
            
        //CHECK IF THE GUILD IS ALREADY IN THE DATABASE
        let result = await query(`SELECT guildID FROM guilds WHERE guildID = "${guildID}"`).catch(err => {})
        if(result.length == 0) return

        //REMOVE THE GUILD FROM THE DATABASE
        await query(`DELETE FROM guilds WHERE guildID = "${guildID}"`).catch(err => {})

    },




    //CHECK IF THE GUILD IS IN THE DATABASE
    //IF IT IS NOT, ADD IT
    guildExists: async (guildID) => {
        return new Promise(async (resolve, reject) => {

            //CHECK IF THE GUILD IS IN THE DATABASE
            let result = await query(`SELECT guildID FROM guilds WHERE guildID = "${guildID}"`).catch(err => reject(err))
            if(result.length == 0) {
                await query(`
                    INSERT INTO guilds VALUES (
                        "${guildID}",
                        "",
                        "",
                        "",
                        "",
                        0
                    )
                `).catch(err => reject(err))
            }

            resolve()

        })
    }
}