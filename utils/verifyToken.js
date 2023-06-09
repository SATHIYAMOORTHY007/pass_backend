const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.Access_token

    if (!token) {
      return next(next(res.status(401)))
    }

    jwt.verify(token, process.env.jwt, (err, user) => {
      if (err) return next(next(res.status(401)))
      req.user = user
      next()
    })
  } catch (err) {
    console.log(err)
  }
}

/* const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(next(res.send(401)))
    }
  })
}

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin || req.params.id) {
      next()
    } else {
      return next(next(res.send(401)))
    }
  })
} */

module.exports = { verifyToken }
