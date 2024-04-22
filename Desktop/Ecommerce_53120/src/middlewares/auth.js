const auth = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login') //si no está logeado, vuelve al login
    }
    return next();
  }
  
  export {auth}