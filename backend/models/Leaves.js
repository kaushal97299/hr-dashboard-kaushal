const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
 
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  documentUrl: {
    type: String, // This will store the file path or URL of uploaded document
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leave', LeaveSchema);