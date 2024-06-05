const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/views/sessions/login')
    }

    if (req.session.user.role != 'admin') {
        return res.status(400).send({
            status: "error",
            message: "Su usuario no se encuentra autorizado"
        })
    }

    return next()
}

export default isAdmin