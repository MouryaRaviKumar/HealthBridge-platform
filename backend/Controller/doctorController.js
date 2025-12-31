const asyncHandler = require("express-async-handler");

//Description       Get all appointments of a particular doctor
//Route             GET /doctor/appointments
//Access            Private
const getAllAppointments = asyncHandler(async(req,res)=>{
    res.status(200).json({ msg: "List of all appointments of a particular doctor" });
})

//Description       Get details of a particular appointment
//Route             GET /doctor/appointments/:appointmentId
//Access            Private
const getAppointmentDetails = asyncHandler(async(req,res)=>{
    res.status(200).json({ msg: "particular Appointment details" });
});

//Description       Get medical history of a particular patient
//Route             GET /doctor/patients/:patientId/history
//Access            Private
const getPatientHistory = asyncHandler(async(req,res)=>{
    res.status(200).json({ msg: "Patient's medical history" });
});

//Description       Create medical Records of the patient
//Route             POST /doctor/medical-records
//Access            Private
const createMedicalRecords = asyncHandler(async(req,res)=>{
    res.status(200).json({ msg: "Create medical Records of the patient" });
});

module.exports = {
    getAllAppointments,
    getAppointmentDetails,
    getPatientHistory,
    createMedicalRecords
}