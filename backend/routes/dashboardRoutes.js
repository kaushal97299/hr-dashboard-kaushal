const express = require("express");
const app = express();
const Employee = require('../models/Employee');
const { protect } = require("middleware/authMiddleware");

app.get("/", protect, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const newHires = await Employee.countDocuments({ status: "New" });
    const resigned = await Employee.countDocuments({ status: "Resigned" });

    const employeeList = await Employee.find().limit(5).sort({ createdAt: -1 });

    res.json({cards: {totalEmployees,
        newHires,
        resigned
      },
      recentEmployees: employeeList,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});

module.exports = app;
