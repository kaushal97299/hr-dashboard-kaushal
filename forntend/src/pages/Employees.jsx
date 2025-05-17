import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../components/UserTable";

const Employes = () => {
  const [employes, setEmployes] = useState([]);

  // Fetch all employees
  const fetchEmployes = async () => {
    try {
      const res = await axios.get("https://hr-dashboard-kaushal.onrender.com/api/employees/all");
      setEmployes(res.data);
    } catch (error) {
      console.error("Error fetching employes", error);
    }
  };

const updateEmployeePosition = async (id, newPosition) => {
  console.log("Sending position update with ID:", id, "Data:", newPosition);

  try {
    const response = await axios.patch(
      `https://hr-dashboard-kaushal.onrender.com/api/employees/position/${id}`,
      newPosition
    );
    console.log("Backend Response:", response.data); // Check what the backend is returning
    fetchEmployes();
  } catch (error) {
    console.error("Error updating employee position", error);
  }
};
console.log("App > updateEmployeePosition:", updateEmployeePosition);


  // Delete employee
  const deleteEmployes = async (id) => {
    try {
      await axios.delete(`https://hr-dashboard-kaushal.onrender.com/api/employees/${id}`);
      fetchEmployes();
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  // Call on mount
  useEffect(() => {
    fetchEmployes();
  }, []);

  return (
    <>
      <UserTable
        type={"Employes"}
        users={employes}
        onStatusChange={updateEmployeePosition}
         updateEmployeePosition={updateEmployeePosition}
        onDelete={deleteEmployes}
      />
    </>
  );
};

export default Employes;
