module.exports = function(req, res, next) {
    // authorisation function sets the req.user
    // 401 unauthorised (meaning the json web token given by the user was wrong currently, but they can access if they give the wrong token) 
    // 403 forbidden (meaning the user can not access)

    console.log(req.user.isAdmin);
    if (!req.user.isAdmin) return res.status(403).send('Access denied. Not an admin.');

    next();
}