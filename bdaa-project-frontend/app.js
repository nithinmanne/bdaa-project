'use strict';
// const assert = require('assert') // Only For Debug
const express = require('express')
const app = express()
app.use(express.static('public'))
app.set('view engine', 'pug')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const favicon = require('serve-favicon')
app.use(favicon('public/favicon.ico'))

const account = require('./table/account')

const hbase = require('hbase')
const hclient = hbase({ host: process.argv[3], port: Number(process.argv[4])})
// const hclient = hbase({ host: 'localhost', port: 8070})

const kafka = require('kafka-node')
const kafkaClient = new kafka.KafkaClient({kafkaHost: process.argv[5]})
// const kafkaClient = new kafka.KafkaClient({kafkaHost: 'b-1.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092,b-2.mpcs53014-kafka.fwx2ly.c4.kafka.us-east-2.amazonaws.com:9092'})
const kafkaProducer = new kafka.Producer(kafkaClient)

const indexPage = require('./pages/index')
app.use('/', indexPage(hclient))
const registerPage = require('./pages/register')
app.use('/register', registerPage(hclient))
const logoutPage = require('./pages/logout')
app.use('/logout', logoutPage())
const manualSubmitPage = require('./pages/manual_submit')
app.use('/manual_submit', manualSubmitPage(hclient, kafkaProducer))
// app.use('/manual_submit', manualSubmitPage(hclient, null))
const buyPage = require('./pages/buy')
app.use('/buy', buyPage(hclient))
const sellPage = require('./pages/sell')
app.use('/sell', sellPage(hclient))
const statsPage = require('./pages/stats')
app.use('/stats', statsPage(hclient))



const port = Number(process.argv[2]);
// const port = 3000
app.listen(port);
