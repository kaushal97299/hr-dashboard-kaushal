import "../styles/sidebar.css";
import { useState, useEffect } from "react"; 
import { FaSignOutAlt } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { faLeaf} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import logo from '/public/k.png';

const Sidebar = () => {
  const navigate = useNavigate(); 
  // eslint-disable-next-line no-unused-vars
  const [confirmLogout, setConfirmLogout] = useState(false); 

  // Function to handle logout
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      // Clear localStorage or other stored data here
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
      navigate("/login"); 
    }
  };

  // Function to check token expiration
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
     const decodedToken = jwtDecode(token); 
      const currentTime = Date.now() / 1000; // Current time in seconds
      console.log(decodedToken.exp - currentTime)
      // Check if the token is expired
      if (decodedToken.exp < currentTime) {
        handleLogout(); // Logout if token is expired
      }
    }
  };

  // Auto-logout functionality based on inactivity and token expiry
  useEffect(() => {
    const timeoutDuration = 120 * 60 * 1000; // 120 minutes
    let logoutTimer;
    console.log(timeoutDuration)
    const resetLogoutTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        handleLogout();
      }, timeoutDuration);
    };

    // Check for token expiration on component mount
    checkTokenExpiration();

    // Attach event listeners to track user activity
    window.addEventListener("mousemove", resetLogoutTimer);
    window.addEventListener("keypress", resetLogoutTimer);

    // Set initial timer
    resetLogoutTimer();

    // Cleanup event listeners on component unmount
    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetLogoutTimer);
      window.removeEventListener("keypress", resetLogoutTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside>
      <div className="logo" role="banner" tabIndex={0}>
        {/* <div className="logo-box">
          <img src={logo} alt="logo" />
        </div> */}
        <span className="logo-text">HR Dashboard</span>
      </div>
      <input
        type="search"
        placeholder="Search"
        aria-label="Sidebar search"
        className="search-input"
      />
      <nav aria-label="Main navigation">
        <div className="section-label">Recruitment</div>
        <NavLink
          to={'candidates'}
          className={({ isActive }) => (isActive ? "active navlink" : "navlink")}
        >
         <FontAwesomeIcon icon={faUser} />
          Candidates
        </NavLink>
        <div className="section-label">Organization</div>
        <NavLink
          to={'employees'}
          className={({ isActive }) => (isActive ? "active navlink" : "navlink")}
        >
          <FontAwesomeIcon icon={faUsers}/>
          Employees
        </NavLink>
        <NavLink
          to={'attendance'}
          className={({ isActive }) => (isActive ? "active navlink" : "navlink")}
        >
          <FontAwesomeIcon icon={faChartBar}/>
          Attendance
        </NavLink>
        <NavLink
          to={'leaves'}
          className={({ isActive }) => (isActive ? "active navlink" : "navlink")}
        >
          <FontAwesomeIcon icon={faLeaf}/>
          Leaves
        </NavLink>
        <div className="section-label">Others</div>
        <NavLink
          onClick={handleLogout}
          className={({ isActive }) => (isActive ? "active navlink" : "navlink")}
        >
          <FaSignOutAlt className="icon" />
          Logout
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
