const asyncHandler = require("express-async-handler");

const DoctorStatus = asyncHandler((req, res, next) => {
    // Ensure user exists and is a doctor
    if (!req.user || !req.user.isDoctor) {
        res.status(403);
        throw new Error("Not a doctor account");
    }

    // Ensure doctor info exists and status is working
    if (!req.user.doctorInfo || req.user.doctorInfo.status !== "working") {
        res.status(403);
        throw new Error("Doctor account is not active");
    }

    next();
});

module.exports = { DoctorStatus };
