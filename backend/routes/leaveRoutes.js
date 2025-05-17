const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const Leave = require('../models/Leaves');
const Employee = require('../models/Employees');

// Middleware to parse JSON
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Check if employee is present
const checkEmployeePresence = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const status = employee.attendanceStatus || employee.attendenceStatus;
    if (status && status.toLowerCase() === 'present') {
      req.employee = employee;
      next();
    } else {
      return res.status(403).json({
        message: 'Only present employees can apply for leave.',
        currentStatus: status
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while checking employee status.' });
  }
};

// POST /request – Create Leave Request (with file)
app.post('/request', upload.single('document'), checkEmployeePresence, async (req, res) => {
  try {
    const { employeeId, reason, fromDate, toDate } = req.body;
    let documentUrl = null;

    if (req.file) {
      documentUrl = `/uploads/${req.file.filename}`;
    }

    if (!employeeId || !reason || !fromDate ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const leave = new Leave({
      employeeId,
      reason,
      fromDate,
      documentUrl
    });

    await leave.save();
    res.status(201).json({ message: 'Leave request submitted.', leave });
  } catch (error) {
    console.error('Leave request error:', error);
    res.status(500).json({ message: 'Error submitting leave request.' });
  }
});
// GET /leaves - List All Leaves with pagination
app.get('/leaves', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('employeeId', 'name position department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Leave.countDocuments(query);

    res.json({
      success: true,
      data: leaves,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch leave requests.' 
    });
  }
});

// PATCH /:id/status - Update Leave Status
app.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid status is required (Pending, Approved, Rejected).' 
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name');

    if (!leave) {
      return res.status(404).json({ 
        success: false,
        message: 'Leave not found.' 
      });
    }

    res.json({ 
      success: true,
      data: leave,
      message: 'Leave status updated successfully.' 
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to update leave status.' 
    });
  }
});

// GET /present - Get present employees
app.get('/present', async (req, res) => {
  try {
    const presentEmployees = await Employee.find({
      $or: [
        { attendanceStatus: { $regex: 'present', $options: 'i' } },
        { attendenceStatus: { $regex: 'present', $options: 'i' } }
      ]
    }).select('_id name position department');

    res.json({
      success: true,
      data: presentEmployees,
      count: presentEmployees.length
    });
  } catch (error) {
    console.error('Error fetching present employees:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch present employees.' 
    });
  }
});

module.exports = app;