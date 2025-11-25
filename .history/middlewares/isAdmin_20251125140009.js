module.exports = function(req, res, next) {
    if (req.user.role !== "owner") {
        req.flash("error", "You are not allowed here");
        return res.redirect("/");
    }
    next();
};