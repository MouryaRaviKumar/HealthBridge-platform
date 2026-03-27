const asyncHandler = require("express-async-handler");

const doctorOnly = asyncHandler((req, res, next) => {
    if (!req.user || req.user.role !== "DOCTOR") {
        res.status(403);
        throw new Error("Doctor access only");
    }
    if (!req.doctor || req.doctor.status !== "working") {
        res.status(403);
        throw new Error("Doctor account is not active or pending approval");
    }
    next();
});

module.exports = { doctorOnly };

