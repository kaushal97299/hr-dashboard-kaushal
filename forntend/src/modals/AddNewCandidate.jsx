import React, { useState } from "react";
import "./AddCandidate.css";
import axios from "axios";

const AddCandidate = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    status: "New",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [inputChecked, setInputChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputChecked || !resumeFile) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("resume", resumeFile); // append file

    try {
      const res = await axios.post("http://localhost:4500/api/candidates/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSave(res.data); // Optionally update parent
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Candidate</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {["name", "email", "phone", "position", "experience"].map((field, idx) => (
              <div key={idx} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}<span className="staar">*</span></label>
                <input
                  type={field === "email" ? "email" : field === "experience" ? "number" : "text"}
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            {/* Resume File Upload */}
            <div className="form-group">
              <label>Resume<span className="staar">*</span></label>
              <input
                type="file"
                accept=".pdf"
                name="resume"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={inputChecked}
                onChange={() => setInputChecked(!inputChecked)}
              />
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

export default AddCandidate;
