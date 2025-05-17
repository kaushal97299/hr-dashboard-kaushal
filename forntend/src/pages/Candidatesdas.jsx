import { useEffect, useState } from "react";
// import { FaEllipsisV, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import "../styles/candidatesuser.css";
import UserTable from "../components/UserTable";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [employes, setEmployes] = useState([]);

  // get candidates from backend
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/candidates/all");
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  //  get employes
  const fetchEmployes = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/employees/all");
      setEmployes(res.data);
    } catch (error) {
      console.error("Error fetching employes", error);
    }
  };

  //  Add candidate
  const addCandidate = async (candidateData) => {
    try {
      await axios.post("http://localhost:4500/api/candidates/add", candidateData);
      fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate", error);
    }
  };

  //  Update candidate status
  const updateCandidateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:4500/api/candidates/status/${id}`, {
        status: newStatus,
      });
      fetchCandidates();

      if (newStatus === "Selected") {
        addEmploye(id);
      }
    } catch (error) {
      console.error("Error updating candidate status", error);
    }
  };

  //  Add employe 
  const addEmploye = async (candidateId) => {
    try {
      await axios.post("http://localhost:4500/api/employees/add", { id: candidateId });
      fetchEmployes();
    } catch (error) {
      console.error("Error adding employe", error);
    }
  };

  //  Delete candidate
  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:4500/api/candidates/${id}`);
      setCandidates((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting candidate", error);
    }
  };

  //  Edit candidate 
  const handleEdit = (id) => {
    console.log("Edit clicked for user ID:", id);
  };

  const handleStatusChange = (id, newStatus) => {
    updateCandidateStatus(id, newStatus);
  };

  useEffect(() => {
    fetchCandidates();
    fetchEmployes();
  }, []);

  return (
    <UserTable
      users={candidates}
      setUsers={addCandidate}
      onStatusChange={handleStatusChange}
      onEdit={handleEdit}
      onDelete={deleteCandidate}
    />
  );
};

export default Candidates;
