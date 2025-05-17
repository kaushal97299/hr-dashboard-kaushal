import React, { useState } from "react";
import "./AddCandidate.css"; 

const EditEmployee = ({ onClose, employeedata, updateEmployeePosition }) => {
   console.log("updateEmployeePosition:", updateEmployeePosition);
  const positionforEmployes = ["Intern", "Full-Time", "Junior", "Senior", "Team Lead"];

  const [formData, setFormData] = useState({
    name: employeedata?.name || "",
    email: employeedata?.email || "",
    phone: employeedata?.phone || "",
    position: employeedata?.position || "",
    department: employeedata?.department || "",
    dateOfJoining: employeedata?.dateOfJoining || "",
  });

  const [inputChecked, setInputChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

 const handleSubmit = (e) => {
  e.preventDefault(); 
  console.log("Checkbox checked:", inputChecked); 
  
  if (!inputChecked) return;  // Ensure the checkbox is checked
  
  console.log("Form Data Submitted:", formData);  // Log form data
  
  if (typeof updateEmployeePosition === "function") {
    console.log("updateEmployeePosition:", updateEmployeePosition);
console.log("typeof updateEmployeePosition:", typeof updateEmployeePosition);

    updateEmployeePosition(employeedata._id, formData); // Calling the function
  }
  onClose();  // Close the modal
};


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Employee</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name<span className="staar">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address<span className="staar">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number<span className="staar">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Department<span className="staar">*</span></label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Position<span className="staar">*</span></label>
              <select name="position" value={formData.position} onChange={handleChange} required>
                <option value="" disabled>Position</option>
                {positionforEmployes.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date of Joining<span className="staar">*</span></label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split("T")[0] : ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <label className="checkbox">
              <input type="checkbox" checked={inputChecked} onChange={() => setInputChecked(!inputChecked)} />
              I hereby declare that the above information is true...
            </label>

            <button type="submit" className={inputChecked ? "save-btn2" : "save-btn"} disabled={!inputChecked}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
