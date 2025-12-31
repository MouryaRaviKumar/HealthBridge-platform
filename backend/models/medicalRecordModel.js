const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    prescriptions: [{
        _id: false,
        medication: {
            type: String,
            required: true,
            trim: true
        },
        dosage: {
            type: String,
            required: true,
            trim: true
        },
        frequency: {
            type: String,
            required: true,
            trim: true
        }
    }],
    dosandonts: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);