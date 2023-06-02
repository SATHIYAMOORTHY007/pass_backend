const express = require('express')
const router = express.Router()
const home = require('../Controllers/home')
const { verifyToken } = require('../utils/verifyToken')

router.get('/home', verifyToken, home)

module.exports = router
