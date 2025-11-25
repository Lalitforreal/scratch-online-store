module.exports = function(req, res, next) {
    if (!req.owner || req.owner.role !== "owner") {
        req.flash("error", "You are not allowed here");
        return res.redirect("/");
    }
    next();
};