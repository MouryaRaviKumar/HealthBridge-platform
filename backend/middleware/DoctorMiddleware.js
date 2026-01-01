const asyncHandler = require("express-async-handler");

const doctorOnly = asyncHandler((req, res, next) => {
    if (!req.user || req.user.role !== "DOCTOR") {
        res.status(403);
        throw new Error("Doctor access only");
    }
    next();
});

module.exports = { doctorOnly };

