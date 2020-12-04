const express = require('express')

const stocks = require('../table/stocks')


module.exports = function (hclient, kafkaProducer) {
    const router = express.Router()
    // Manual Update Page
    router.get('/', function (req, res) {
        stocks.with_stocks_list(hclient, function(stock_symbols) {
            res.render('manual_submit', {stock_symbols: stock_symbols})
        })
    })
    // Manual Update Submit
    router.post('/', function (req, res) {
        const report = {
            stock: req.body['stock'],
            price: req.body['price']
        }
        console.log(report)
        kafkaProducer.send([{topic: 'nithinmanne_project_stock_reports', messages: JSON.stringify(report)}],
            function (err, data) {
                console.log("Kafka Error: " + err)
                console.log(data)
                console.log(report)
                stocks.with_stocks_list(hclient, function(stock_symbols) {
                    res.render('manual_submit', {stock_symbols: stock_symbols, success: true})
                })
            })
    })
    return router
}
