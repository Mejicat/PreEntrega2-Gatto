const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({status: 'error', message: 'Usuario no autorizado'})
  }
  return next()
}

export default { auth }