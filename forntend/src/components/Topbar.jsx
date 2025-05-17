import "../styles/topbar.css";
import { FaEnvelope, FaBell, FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Topbar = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");

  let showable = location.pathname.split("/")[2] ?? "Hello";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        setUsername(parsedUser.name || parsedUser.username || "User");
      } catch (err) {
        console.error("Failed to parse user data", err);
        setUsername("User");
      }
    }
  }, []);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h2>{showable.slice(0, 1).toUpperCase() + showable.slice(1)}</h2>
      </div>

      <div className="top-bar-right">
        <button className="icon-button" aria-label="Messages" type="button">
          <FaEnvelope />
        </button>
        <button className="icon-button" aria-label="Notifications" type="button">
          <FaBell />
        </button>
        <span className="username-display">Hey, {username}</span>
        <button className="icon-button" aria-label="More options" type="button">
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
