const express = require('express')
const router = express.Router()
const {
  register,
  login,
  forgetpaasword,
  resetpassword,
} = require('../Controllers/auth')

router.post('/register', register)
router.post('/forgetpassword', forgetpaasword)
router.post('/resetpassword/:id/:token', resetpassword)

router.post('/login', login)

module.exports = router
