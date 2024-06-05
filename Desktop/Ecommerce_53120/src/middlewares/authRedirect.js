const authRedirect = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/views/sessions/login')
    }
    return next()
  }
  
  export default authRedirect