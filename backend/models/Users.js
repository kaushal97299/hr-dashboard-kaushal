const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {  
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["HR", "Employee", "Admin"],
      default: "HR",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
    contact: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
