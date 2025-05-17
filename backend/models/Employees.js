const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, unique: true },
    position: {
        type: String,
        enum: ["Intern", "Full Time", "Full-Time", "Junior", "Senior", "Team Lead"],
        required: true,
        default: "Intern"
    },
    task: { type: String, required: true, default: "Dashboard Home Page Alignment" },
    attendenceStatus: { type: String, required: true, default: "present", enum: ["present", "absent"] },
    department: { type: String, required: true, default: "Designer" },
    dateOfJoining: { type: Date, required: true, default: Date.now() },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
