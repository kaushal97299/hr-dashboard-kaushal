const express = require("express");
const app = express();
const Candidate = require('../models/Candidates');
const multer = require('multer');
const path = require('path');


// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.post("/add", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, position, experience, status } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) return res.status(400).json({ error: "Resume file required" });
 const resumePath = req.file.filename; 
    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      experience,
      status,
      resume:resumePath,
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    console.error("Candidate Upload Error:", err);
    res.status(500).json({ error: "Server error during candidate upload" });
  }
});

// Get all candidates
app.get("/all", async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates", error: error.message });
    }
});

// Update candidate status
app.patch("/status/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({ message: "Status updated successfully", candidate: updatedCandidate });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
});
// Delete candidate
app.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCandidate = await Candidate.findByIdAndDelete(id);

        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({ message: "Candidate deleted successfully", candidate: deletedCandidate });
    } catch (error) {
        res.status(500).json({ message: "Error deleting candidate", error: error.message });
    }
});

module.exports = app;
