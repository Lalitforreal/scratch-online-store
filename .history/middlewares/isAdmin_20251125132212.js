module.exports = function(req, res, next) {
    if (req.user.role !== "admin") {
        req.flash("error", "You are not allowed here");
        return res.redirect("/");
    }
    next();
};