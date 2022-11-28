const fs = require('fs');
const config = require('../config.js')


module.exports = (type, message) => {

    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    switch(type) {

        case 'error':
            fs.appendFile(`./logs/${year}-${month}-${day}.log`, `[${hour}:${minute}] [ERROR] ${message}\n`, (err) => {if (err) throw err;})
            break;

        case "info":
            fs.appendFile(`./logs/${day}-${month}-${year}.txt`, `[${hour}:${minute}] [INFO] ${message}\n`, (err) => {if (err) throw err;})
            break;

        default:
            console.log(`\x1b[31m[ERROR] Invalid log type: ${type}\x1b[0m`)
            break;
    }

}