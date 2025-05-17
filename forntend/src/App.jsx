import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidatesdas";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leavesuser";
import Attendance from "./pages/Attendances";

const App = () => {
  const token = localStorage.getItem("token"); 
  // const user = JSON.parse(localStorage.getItem("user")); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard/" /> : <Navigate to="/login" />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard/" element={token ? <Dashboard /> : <Navigate to="/login" />}>
          <Route path="" element={<Navigate to={"candidates"} />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="attendance" element={<Attendance/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
