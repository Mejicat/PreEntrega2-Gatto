const isVerified = (req, res, next) => {
    if (!req.session.user.verified) {
      return res.status(401).send({status: 'error', message: 'El usuario no está verificado'})
    }
    return next()
  }
  
  export default isVerified