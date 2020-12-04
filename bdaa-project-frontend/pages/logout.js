const express = require('express')

const cookies = require('../cookies')


module.exports = function () {
    const router = express.Router()
    // Log Out Page
    router.get('/', function (req, res) {
        res.clearCookie(cookies.user_cookie)
        res.redirect('/')
    });
    return router
}
