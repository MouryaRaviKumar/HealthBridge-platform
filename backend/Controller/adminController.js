const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const MedicalRecord = require("../models/medicalRecordModel");

//Description   : Get all doctors
//Route         : GET /admin/doctors
//Access        : Private/Admin
const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({}).lean();
    res.status(200).json(doctors);
});

//Description   : Get all pending doctors
//Route         : GET /admin/doctors/pending
//Access        : Private/Admin
const getPendingDoctors = asyncHandler(async (req, res) => {
    const pendingDoctors = await Doctor.find({ status: "pending" }).lean();
    res.status(200).json(pendingDoctors);
});

//Description   : Approve a doctor
//Route         : PUT /admin/doctors/:doctorId/approve
//Access        : Private/Admin
const approveDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    if(!mongoose.Types.ObjectId.isValid(doctorId)){
        res.status(400);
        throw new Error("Invalid doctor ID");
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }
    if (doctor.status !== "pending") {
        res.status(400);
        throw new Error("Doctor is not in pending status");
    }
    doctor.status = "working";
    await doctor.save();
    res.status(200).json({ message: "Doctor approved successfully" });
});

//Description   : Update doctor status
//Route         : PUT /admin/doctors/:doctorId/status
//Access        : Private/Admin
const updateDoctorStatus = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        res.status(400);
        throw new Error("Invalid doctor ID");
    }

    const allowedStatuses = ["pending", "working", "suspended"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid status value");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    if (doctor.status === status) {
        return res.status(200).json(doctor);
    }

    doctor.status = status;
    await doctor.save();

    res.status(200).json(doctor);
});

//Description   : Get all patients
//Route         : GET /admin/patients
//Access        : Private/Admin
const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({}).lean();
    res.status(200).json(patients);
});

//Description   : Get patient details
//Route         : GET /admin/patients/:patientId
//Access        : Private/Admin
const getPatientDetails = asyncHandler(async (req, res) => {
    const patientId = req.params.patientId;
    if(!mongoose.Types.ObjectId.isValid(patientId)){
        res.status(400);
        throw new Error("Invalid patient ID");
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
        res.status(404);
        throw new Error("Patient not found");
    }
    res.status(200).json(patient);
});

//Description   : Get patient history
//Route         : GET /admin/patients/:patientId/history
//Access        : Private/Admin
const getPatientHistory = asyncHandler(async (req, res) => {
    const patientId = req.params.patientId;
    if(!mongoose.Types.ObjectId.isValid(patientId)){
        res.status(400);
        throw new Error("Invalid patient ID");
    }
    const history = await MedicalRecord.find({ patient: patientId }).lean();
    res.status(200).json(history);
});

//Description   : Get patients of a particular doctor
//Route         : GET /admin/doctors/:doctorId/patients
//Access        : Private/Admin
const getPatientsOfDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId;
    if(!mongoose.Types.ObjectId.isValid(doctorId)){
        res.status(400);
        throw new Error("Invalid doctor ID");
    }
    const patients = await Patient.find({ doctor: doctorId }).lean();
    res.status(200).json(patients);
});

module.exports = {
    getAllDoctors,
    getPendingDoctors,
    approveDoctor,
    updateDoctorStatus,
    getAllPatients,
    getPatientDetails,
    getPatientHistory,
    getPatientsOfDoctor
}