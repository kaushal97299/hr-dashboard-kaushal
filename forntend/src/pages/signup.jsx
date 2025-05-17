import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import Dashboardimg from "/public/logoass.jpg"
import LogoImg from "/public/hrdasbord.png"
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting , setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setSubmitting(true)
      const response = await axios.post("http://localhost:4500/api/auth/register", formData);
      console.log(response);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setSubmitting(false)
  };

  return (<>
          <h1><img src={LogoImg}></img></h1>
    <div className="login-container">
      <div className="login-left">
        <img src={Dashboardimg} alt="Dashboard" className="dashboard-img" />
        <h2>Welcome to Dashboard</h2>
        <p className="htr">Create your account and manage everything at one place.</p>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="hht">Register</h2>
          {error && <p className="error">{error}</p>}

          <label>Full Name<span className="staar">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email Address<span className="staar">*</span></label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password<span className="staar">*</span></label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye/> : <FaEyeSlash />}
            </span>
          </div>

          <label>Confirm Password<span className="staar">*</span></label>
          <div className="password-field">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ?  <FaRegEye/> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" style={{opacity:`${submitting?".5":"1"}`}} disabled={submitting}> {submitting?"Registering wait...":"Register"}</button>
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
