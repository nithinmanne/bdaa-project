const dateformat = require('dateformat')

const util = require('../util')

const stock_symbols_table = 'nithinmanne_project_stock_symbols'
const stocks_table = 'nithinmanne_project_stocks'
const stocks_latest_table = 'nithinmanne_project_stocks_latest'

module.exports.with_stocks_list = function(hclient, cb) {
    hclient.table(stock_symbols_table)
           .scan({}, (err, rows) => {
               if (err) {
                   cb({})
                   return
               }
               const stock_symbols = {}
               rows.forEach(row => {
                   stock_symbols[row['key']] = row['$']
               })
               cb(stock_symbols)
           })
}

module.exports.with_stock_price = function(hclient, stock, date, cb) {
    const key = 'price:price'
    const date_obj = new Date(date)
    hclient.table(stocks_table)
           .row(stock + '_' + dateformat(date_obj, "mm/dd/yyyy", true))
           .get((err, rows) => {
               if (err) {
                   cb(-1)
                   return
               }
               const price_map = util.rowToMap(rows)
               if (key in price_map)
                   cb(price_map[key])
               else
                   cb(-1)
           })
}

module.exports.with_latest_price = function(hclient, cb) {
    const price_key = 'latest:price'
    const date_key = 'latest:date'
    hclient.table(stocks_latest_table)
        .scan({}, (err, rows) => {
            if (err) {
                cb({}, {})
                return
            }
            const latest_prices = {}
            const latest_date = {}
            rows.forEach(row => {
                if (row['column'] === price_key)
                    latest_prices[row['key']] = Number(row['$'])
                else if (row['column'] === date_key)
                    latest_date[row['key']] = row['$']
            })
            cb(latest_prices, latest_date)
        })
}

module.exports.with_dated_stock_prices = function(hclient, date, cb) {
    const date_obj = new Date(date)
    // Probably my biggest regret, but I couldn't get it to work otherwise :(
    hclient.table(stocks_table)
        .scan({}, (err, rows) => {
            if (err) {
                cb({})
                return
            }
            const prices = {}
            rows.forEach(row => {
                let spl = row['key'].split('_')
                if (spl[1] === dateformat(date_obj, "mm/dd/yyyy", true))
                    prices[spl[0]] = Number(row['$'])
            })
            cb(prices)
        })
}
