import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import Dashboardimg from "/public/logoass.jpg";
import LogoImg from "/public/hrdasbord.png"
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("All fields are required");
    }

    try {
      setSubmitting(true);
      const res = await axios.post("https://hr-dashboard-kaushal.onrender.com/api/auth/login", formData);

      // Store token and user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

       // Redirect to dashboard
       window.location.reload();
        navigate("/dashboard/candidates");

      // Auto logout after 2 hours
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/login");
      }, 2 * 60 * 60 * 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setSubmitting(false);
  };

  return (<>
        <h1><img src={LogoImg}></img></h1>
    <div className="login-container">
      <div className="login-left">
        <img src={Dashboardimg} alt="Dashboard" className="dashboard-img" />
        <h2>Welcome Back!</h2>
        <p>Login to manage your HR dashboard.</p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="htrr">Login</h2>
          {error && <p className="error">{error}</p>}

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
              {showPassword ? <FaRegEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "wait..." : "Login"}
          </button>

          <p className="login-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
