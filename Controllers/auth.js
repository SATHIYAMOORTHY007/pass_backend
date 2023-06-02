const express = require('express')
const User = require('../Models/user')
const bcrypt = require('bcrypt')
const send = require('send')
const jwt = require('jsonwebtoken')
const user = require('../Models/user')
const nodemailer = require('nodemailer')
const sendEmail = require('../utils/email')

const register = async (req, res) => {
  try {
    const { username, email_id, pwd } = req.body
    if (!email_id || !pwd)
      return res.status(400).send({ message: 'email or password required' })
    //duplicated email
    const duplicate = await User.findOne({ email: email_id }).exec()
    if (duplicate) return res.send({ message: 'already existing..' })

    const hashpwd = await bcrypt.hash(pwd, 10)
    const result = await User.create({
      username: username,
      email: email_id,
      password: hashpwd,
    })
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.jwt,
    )

    res.send({ message: `user created ` })
  } catch (err) {
    console.log(err)
  }
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email_id }).exec()
    if (!user) return res.sendStatus(404).json({ message: 'user not found' })

    const isPassword = await bcrypt.compare(req.body.pwd, user.password)

    if (!isPassword)
      return res.sendStatus(404).json({ message: 'password not match' })

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.jwt,
    )

    const { password, isAdmin, ...otherDetails } = user._doc
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json({ details: { ...otherDetails }, token, isAdmin, password })
  } catch (err) {
    console.log(err)
    res.json(err)
  }
}

//forget password
const forgetpaasword = async (req, res) => {
  try {
    const { email_Id } = req.body
    const olduser = await User.findOne({ email: email_Id })
    if (!olduser) {
      return res.send({ message: 'email doesnot Exists....' })
    }
    const secret = process.env.jwt + olduser.password

    const token = jwt.sign({ email: olduser.email, id: olduser._id }, secret, {
      expiresIn: '50m',
    })
    const link = `${process.env.frontend}/resetpassword/${olduser._id}/${token}`

    //send mail
    sendEmail({
      email: olduser.email,
      subject: 'testing',
      link: link,
    })
    res.send(' please check your email')
  } catch (err) {
    console.log(err)
  }
}

//reset password

const resetpassword = async (req, res) => {
  const { id, token } = req.params
  const { pwd, conpwd } = req.body
  const olduser = await User.findOne({ _id: id })
  if (!olduser) {
    return res.json('not valid user')
  }
  const secret = process.env.jwt + olduser.password

  try {
    const verify = jwt.verify(token, secret)
    if (pwd == conpwd) {
      const hashpwd = await bcrypt.hash(pwd, 10)
      await User.updateOne({ _id: id }, { password: hashpwd })
    }

    res.json({ message: 'success', user })
  } catch (err) {
    console.log(err)
  }
}

module.exports = { register, login, forgetpaasword, resetpassword }
