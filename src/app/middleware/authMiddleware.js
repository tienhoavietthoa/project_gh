function wantsJSON(req) {
    return req.xhr ||
        (req.get('accept') && req.get('accept').includes('application/json')) ||
        req.is('application/json') ||
        req.query.json === '1';
}

function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
    res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.id_level === 1) {
        return next();
    }
    if (wantsJSON(req)) return res.status(403).json({ error: "Không có quyền truy cập" });
    res.redirect('/');
}

function ensureCustomer(req, res, next) {
    if (req.session && req.session.user && req.session.user.id_level === 2) {
        return next();
    }
    if (wantsJSON(req)) return res.status(401).json({ error: "Chưa đăng nhập" });
    res.redirect('/auth/login');
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin,
    ensureCustomer
};