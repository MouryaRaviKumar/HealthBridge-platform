const mongoose = require("mongoose");
const Patient = require("../models/patientModel");
const MedicalRecord = require("../models/medicalRecordModel");
const asyncHandler = require("express-async-handler");
const Doctor = require("../Models/doctorModel");
const Appointment = require("../Models/appointmentModel");

//Description       Get all appointments of a particular doctor
//Route             GET /doctor/appointments
//Access            Private
const getAllAppointments = asyncHandler(async(req,res)=>{
    const doctorId = req.doctor.id;
    if(!doctorId){
        res.status(400);
        throw new Error("Doctor not found");
    }
    const appointments = await Appointment.find({ doctor: doctorId }).lean();
    res.status(200).json(appointments);
})

//Description       Get details of a particular appointment
//Route             GET /doctor/appointments/:appointmentId
//Access            Private
const getAppointmentDetails = asyncHandler(async(req,res)=>{
    res.status(200).json(req.appointment);
});

//Description       Get medical history of a particular patient
//Route             GET /doctor/patients/:patientId/history
//Access            Private
const getPatientHistory = asyncHandler(async(req,res)=>{
    const { patientId } = req.params;

    // Validate patientId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        res.status(400);
        throw new Error("Invalid patient ID");
    }

    // Find patient and select only medicalHistory
    const patient = await Patient
        .findOne({ user: patientId })
        .select("medicalHistory");

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found");
    }

    res.status(200).json(patient.medicalHistory || []);
});

// Description: Create medical records of the patient
// Route:       POST /doctor/:appointmentId/medical-records
// Access:      Private
const createMedicalRecords = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { diagnosis, prescription, dosandonts } = req.body;
    const doctorId = req.doctor.id;

    // Validate appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        res.status(400);
        throw new Error("Invalid appointment ID");
    }

    // Validate input
    if (!diagnosis || !prescription) {
        res.status(400);
        throw new Error("Diagnosis and prescription are required");
    }
    try {
        // Find appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            res.status(404);
            throw new Error("Appointment not found");
        }
        // Create medical record
        const medicalRecord = await MedicalRecord.create({
            patient: appointment.patient,
            doctor: doctorId,
            appointment: appointmentId,
            diagnosis,
            prescriptions: prescription,
            dosandonts
        });
        res.status(201).json(medicalRecord);
    }catch(err){
        throw err;
    }
});

module.exports = {
    getAllAppointments,
    getAppointmentDetails,
    getPatientHistory,
    createMedicalRecords
}