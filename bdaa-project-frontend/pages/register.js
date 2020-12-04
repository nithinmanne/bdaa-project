const express = require('express')

const account = require('../table/account')
const cookies = require('../cookies')


module.exports = function (hclient) {
    const router = express.Router()
    // Sign Up Page
    router.get('/', function (req, res) {
        res.clearCookie(cookies.user_cookie)
        res.render('register')
    })
    // Sign Up Submit
    router.post('/', function (req, res) {
        const username = req.body['username']
        const password = req.body['password']
        account.register(hclient, username, password, function (correct) {
            if (correct) {
                res.cookie(cookies.user_cookie, username)
                res.redirect('/')
            } else {
                res.clearCookie(cookies.user_cookie)
                res.render('register', {exists: true})
            }
        })
    })
    return router
}
