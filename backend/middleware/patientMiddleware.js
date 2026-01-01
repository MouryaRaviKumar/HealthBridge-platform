const asyncHandler = require("express-async-handler");

const patientOnly = asyncHandler((req, res, next) => {
    if (!req.user || req.user.role !== "PATIENT") {
        res.status(403);
        throw new Error("Patient access only");
    }
    next();
});

module.exports = { patientOnly };
