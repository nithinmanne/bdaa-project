const express = require('express')

const account = require('../table/account')
const cookies = require('../cookies')


module.exports = function (hclient) {
    const router = express.Router()
    // Login Page
    router.get('/', function (req, res) {
        const username = req.cookies[cookies.user_cookie]
        if (username !== undefined && username !== '') {
            res.redirect('/stats')
            return
        }
        res.render('index')
    });
    // Login Submit
    router.post('/', function (req, res) {
        const username = req.body['username']
        const password = req.body['password']
        account.chkauth(hclient, username, password, function (correct) {
            if (correct) {
                res.cookie(cookies.user_cookie, username)
                res.redirect('/')
            } else {
                res.clearCookie(cookies.user_cookie)
                res.render('index', {incorrect: true})
            }
        })
    })
    return router
}
