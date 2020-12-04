const express = require('express')

const stocks = require('../table/stocks')
const account = require('../table/account')
const cookies = require('../cookies')


const noInfo = 'No Price Information for Selected Date'
const sellError = 'Not Enough Stocks/Sell Error'
const sellSuccess = 'Sell Successful'


module.exports = function (hclient) {
    const router = express.Router()
    // Sell Page
    router.get('/', function (req, res) {
        const username = req.cookies[cookies.user_cookie]
        if (username === undefined || username === '') {
            res.redirect('/logout')
            return
        }
        account.with_cash(hclient, username, function(cash) {
            if (cash === -1) {
                res.redirect('/logout')
                return
            }
            stocks.with_stocks_list(hclient, function (stock_symbols) {
                res.render('sell', {username: username,  cash: cash, stock_symbols: stock_symbols})
            })
        })
    });
    // Sell Submit
    router.post('/', function (req, res) {
        const username = req.cookies[cookies.user_cookie]
        if (req.body['step'] === '1') {
            stocks.with_stock_price(hclient, req.body['stock'], req.body['date'], price => {
                if (price === -1)
                    account.with_cash(hclient, username, function(cash) {
                        if (cash === -1) {
                            res.redirect('/logout')
                            return
                        }
                        stocks.with_stocks_list(hclient, function (stock_symbols) {
                            res.render('sell', {
                                username: username, cash: cash,
                                stock_symbols: stock_symbols, error: noInfo
                            })
                        })
                    })
                else
                    account.with_cash(hclient, username, function(cash) {
                        if (cash === -1) {
                            res.redirect('/logout')
                            return
                        }
                        account.with_stock_count(hclient, username, req.body['stock'], function(count) {
                            if (count === -1) {
                                res.redirect('/logout')
                                return
                            }
                            res.render('sell_confirm', {
                                username: username, cash: cash, owned: count,
                                stock: req.body['stock'], price: price
                            })
                        })
                    })
            })
        }
        else {
            account.sell_stock(hclient, username, req.body['stock'], Number(req.body['count']), Number(req.body['price']),
                (correct) => {
                    if (correct) {
                        account.with_cash(hclient, username, function(cash) {
                            if (cash === -1) {
                                res.redirect('/logout')
                                return
                            }
                            stocks.with_stocks_list(hclient, function (stock_symbols) {
                                res.render('sell', {
                                    username: username, cash: cash,
                                    stock_symbols: stock_symbols, success: sellSuccess
                                })
                            })
                        })
                    }
                    else
                        account.with_cash(hclient, username, function(cash) {
                            if (cash === -1) {
                                res.redirect('/logout')
                                return
                            }
                            stocks.with_stocks_list(hclient, function (stock_symbols) {
                                res.render('sell', {
                                    username: username, cash: cash,
                                    stock_symbols: stock_symbols, error: sellError
                                })
                            })
                        })
                })
        }
    })
    return router
}
