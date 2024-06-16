const auth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ status: 'error', message: 'Usuario no autorizado' });
  }
  return next();
};

export default auth;