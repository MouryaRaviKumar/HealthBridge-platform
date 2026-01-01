const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(403);
        throw new Error("Admin access only");
    }
}; 

module.exports = { adminOnly };