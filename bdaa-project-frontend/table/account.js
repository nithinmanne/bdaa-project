
const util = require('../util')
const stocks = require('./stocks')

const account_table = 'nithinmanne_project_accountdb'

module.exports.chkauth = function(hclient, username, password, cb) {
    const key = 'account:password'
    hclient.table(account_table)
           .row(username).get((err, rows) => {
        if (err) {
            cb(false)
            return
        }
        const accountdb = util.rowToMap(rows)
        if (key in accountdb)
            cb(accountdb[key] === password)
        else
            cb(false)
    })
}

module.exports.register = function(hclient, username, password, cb) {
    hclient.table(account_table)
        .row(username).exists((err, exists) => {
            if (err || exists) {
                cb(false)
                return
            }
            stocks.with_stocks_list(hclient, stock_symbols => {
                let keys_arr = ['account:password', 'account:cash']
                let vals_arr = [password, '1000000']
                for (const key in stock_symbols) {
                    keys_arr.push('account:' + key)
                    vals_arr.push('0')
                }
                hclient.table(account_table)
                       .row(username).put(
                           keys_arr,
                           vals_arr,
                           (err, success) => {
                               if (err || !success) {
                                   cb(false)
                                   return
                               }
                               cb(true)
                           })
            })
    })
}

module.exports.with_accountdb = function(hclient, username, cb) {
    hclient.table(account_table)
        .row(username).get((err, rows) => {
        if (err) {
            cb({})
            return
        }
        const accountdb = util.rowToMap(rows)
        cb(accountdb)
    })
}

module.exports.with_cash = function(hclient, username, cb) {
    const key = 'account:cash'
    hclient.table(account_table)
        .row(username).get((err, rows) => {
        if (err) {
            cb(-1)
            return
        }
        const accountdb = util.rowToMap(rows)
        if (key in accountdb)
            cb(Number(accountdb[key]))
        else
            cb(-1)
    })
}

module.exports.with_stock_count = function(hclient, username, stock, cb) {
    const key = 'account:' + stock
    hclient.table(account_table)
        .row(username).get((err, rows) => {
        if (err) {
            cb(-1)
            return
        }
        const accountdb = util.rowToMap(rows)
        if (key in accountdb)
            cb(Number(accountdb[key]))
        else
            cb(-1)
    })
}

module.exports.buy_stock = function(hclient, username, stock, count, price, cb) {
    if (count <= 0) {
        cb(false)
        return
    }
    cash_key = 'account:cash'
    hclient.table(account_table)
        .row(username).get((err, rows) => {
        if (err) {
            cb(false)
            return
        }
        const stock_key = 'account:' + stock
        const accountdb = util.rowToMap(rows)
        if (!(stock_key in accountdb)) {
            cb(false)
            return
        }
        if (!(cash_key in accountdb) || Number(accountdb[cash_key]) < count*price) {
            cb(false)
            return
        }
        hclient.table(account_table)
            .row(username).put(
                [cash_key, stock_key],
                [(Number(accountdb[cash_key]) - count*price).toString(),
                 (Number(accountdb[stock_key]) + count).toString()],
                (err, success) => {
                    if (err || !success) {
                        cb(false)
                        return
                    }
                    cb(true)
                })
    })
}

module.exports.sell_stock = function(hclient, username, stock, count, price, cb) {
    if (count <= 0) {
        cb(false)
        return
    }
    cash_key = 'account:cash'
    hclient.table(account_table)
        .row(username).get((err, rows) => {
        if (err) {
            cb(false)
            return
        }
        const stock_key = 'account:' + stock
        const accountdb = util.rowToMap(rows)
        if (!(stock_key in accountdb) || Number(accountdb[stock_key]) < count) {
            cb(false)
            return
        }
        if (!(cash_key in accountdb)) {
            cb(false)
            return
        }
        hclient.table(account_table)
            .row(username).put(
            [cash_key, stock_key],
            [(Number(accountdb[cash_key]) + count*price).toString(),
                (Number(accountdb[stock_key]) - count).toString()],
            (err, success) => {
                if (err || !success) {
                    cb(false)
                    return
                }
                cb(true)
            })
    })
}
