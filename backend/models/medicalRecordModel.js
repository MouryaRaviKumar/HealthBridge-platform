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
        required: true,
        unique: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    prescriptions: {
        type: String,
        required: true,
        trim: true
    },
    dosandonts: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});


//  Auto-push medical record into patient's medicalHistory
medicalRecordSchema.post("save", async function (doc) {
    try {
        await mongoose.model("Patient").findByIdAndUpdate(
            doc.patient,
            { $push: { medicalHistory: doc._id } }
        );
    } catch (error) {
        console.error("Failed to update patient medical history:", error);
    }
});

module.exports =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", medicalRecordSchema);
