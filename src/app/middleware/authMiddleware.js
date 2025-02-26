function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.id_level === 1) {
        return next();
    }
    res.redirect('/');
}

function ensureCustomer(req, res, next) {
    if (req.session && req.session.user && req.session.user.id_level === 2) {
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin,
    ensureCustomer
};