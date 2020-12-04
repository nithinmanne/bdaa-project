const express = require('express')

const stocks = require('../table/stocks')
const account = require('../table/account')
const cookies = require('../cookies')


module.exports = function (hclient) {
    const router = express.Router()
    // Stats Page
    router.get('/', function (req, res) {
        const username = req.cookies[cookies.user_cookie]
        if (username === undefined || username === '') {
            res.redirect('/logout')
            return
        }
        stocks.with_latest_price(hclient, (latest_prices, latest_date) => {
            account.with_accountdb(hclient, username, accountdb => {
                let total_stocks = 0
                let total_value = 0
                const table = {}
                for (const stock in latest_prices) {
                    const count = Number(accountdb['account:' + stock])
                    const value = accountdb['account:' + stock] * latest_prices[stock]
                    table[stock] = [count, value, latest_date[stock]]
                    total_stocks += count
                    total_value += value
                }
                res.render('stats', {username: username, cash: accountdb['account:cash'],
                                                 stats_table: table, total_stocks: total_stocks,
                                                 total_value: total_value})
            })
        })
    });
    // Stats Submit
    router.post('/', function (req, res) {
        const username = req.cookies[cookies.user_cookie]
        stocks.with_dated_stock_prices(hclient, req.body['date'], prices => {
            account.with_accountdb(hclient, username, accountdb => {
                let total_stocks = 0
                let total_value = 0
                const table = {}
                for (const stock in prices) {
                    const count = Number(accountdb['account:' + stock])
                    const value = accountdb['account:' + stock] * prices[stock]
                    table[stock] = [count, value]
                    total_stocks += count
                    total_value += value
                }
                res.render('stats_confirm', {username: username, cash: accountdb['account:cash'],
                    date: req.body['date'], stats_table: table, total_stocks: total_stocks,
                    total_value: total_value})
            })
        })
    })
    return router
}
