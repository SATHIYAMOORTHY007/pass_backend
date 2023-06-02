const express = require('express')

const home = (req, res) => {
  res.json('hello user')
}

module.exports = home
