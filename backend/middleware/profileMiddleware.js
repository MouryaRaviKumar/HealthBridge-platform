const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const asyncHandler = require("express-async-handler");

const attachProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, no user found");
    }

    if (req.user.role === "PATIENT") {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            res.status(404);
            throw new Error("Patient profile not found");
        }
        req.patient = patient;
    } else if (req.user.role === "DOCTOR") {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            res.status(404);
            throw new Error("Doctor profile not found");
        }
        req.doctor = doctor;
    }

    next();
});

module.exports = { attachProfile };
