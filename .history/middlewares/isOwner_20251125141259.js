const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async function (req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.flash("error", "Please login first");
            return res.redirect("/owners/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const owner = await ownerModel.findById(decoded.id);
        if (!owner) {
            req.flash("error", "Invalid owner");
            return res.redirect("/owners/login");
        }

        req.owner = owner; // IMPORTANT
        next();
    } catch (err) {
        req.flash("error", "Authentication failed");
        return res.redirect("/owners/login");
    }
};