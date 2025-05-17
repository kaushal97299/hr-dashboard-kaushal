/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaEllipsisV, FaDownload } from "react-icons/fa";
import "../styles/candidatesuser.css";
import AddCandidate from "../modals/AddNewCandidate";
import EditEmployee from "../modals/EditEmployee";

const UserTable = ({
  users,
  type = "candidate",
  onStatusChange,
  onEdit,
  onDelete,
  positionforEmployes,
  setUsers,
  updateEmployeePosition,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // status filter
  const [searchTerm, setSearchTerm] = useState(""); // search filter
  const employeedata = users.find((user) => user._id === openMenuId);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDownloadResume = (fileName) => {
    if (fileName) {
      window.open(`http://localhost:4500/uploads/resumes/${fileName}`, "_blank");
    }
  };

  const handleEdit = (userId) => {
    setOpenMenuId(userId);
    setShowModal("edit");
  };

  const handleAdd = () => {
    setShowModal("add");
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <section className="candidate-section" aria-label="Candidates section">
      {/* Controls */}
      <div className="candidate-controls">
        <div className="candidate-controls-left">
          {type === "candidate" && (
            <select onChange={handleStatusFilterChange} value={selectedStatus}>
              <option value="">Status</option>
              <option value="New">New</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
          <select aria-label="Position filter">
            <option disabled selected>
              Position
            </option>
            <option>Manager</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="candidate-controls-right">
          <input
            type="search"
            placeholder="Search"
            className="candidate-search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {type === "candidate" && (
            <button className="btn-add" onClick={handleAdd} type="button">
              Add Candidate
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper" role="region" aria-label="Users table">
        <table>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Name</th>
              {type !== "attendence" && (
                <>
                  <th>Email</th>
                  <th>Mobile Number</th>
                </>
              )}
              <th>Position</th>
              <th>
                {type === "candidate"
                  ? "Status"
                  : type !== "attendence"
                  ? "Department"
                  : ""}
              </th>
              {type === "attendence" && <th>Task</th>}
              <th>
                {type === "candidate"
                  ? "Experience"
                  : type !== "attendence"
                  ? "Date of joining"
                  : "Status"}
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user?.name}</td>

                {type !== "attendence" && (
                  <>
                    <td>{user?.email}</td>
                    <td>{user?.phone}</td>
                  </>
                )}

                <td>{user?.position}</td>

                <td>
                  {type === "candidate" ? (
                    <select
                      value={user.status}
                      onChange={(e) => onStatusChange(user._id, e.target.value)}
                    >
                      <option disabled value="">
                        Status
                      </option>
                      <option value="New">New</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  ) : (
                    user?.department
                  )}
                </td>

                {type === "attendence" && <td>{user.task}</td>}

                <td>
                  {type === "candidate"
                    ? `${user.experience} years`
                    : type !== "attendence"
                    ? new Date(user?.dateOfJoining).toLocaleDateString()
                    : (
                        <select
                          className={`select-attendance ${
                            user.attendenceStatus === "present"
                              ? "present-select"
                              : user.attendenceStatus === "absent"
                              ? "absent-select"
                              : "default-select"
                          }`}
                          value={user.attendenceStatus}
                          onChange={(e) =>
                            onStatusChange(user._id, e.target.value, "attendence")
                          }
                        >
                          <option disabled value="">
                            Status
                          </option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      )}
                </td>

                {/* Action Column */}
                <td>
                  <div className="action-wrapper">
                    <FaEllipsisV
                      title="More actions"
                      onClick={() => toggleMenu(user._id)}
                      style={{ cursor: "pointer" }}
                    />
                    {openMenuId === user._id && (
                      <div className="action-icons">
                        {type !== "candidate" ? (
                          <p className="ac-icons-p1" onClick={() => handleEdit(user._id)}>
                            Edit
                          </p>
                        ) : (
                          <FaDownload
                            title="Download resume"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDownloadResume(user.resume)}
                          />
                        )}
                        <p
                          className="ac-icons-p1"
                          title="Delete"
                          onClick={() => onDelete(user._id)}
                        >
                          Delete
                        </p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showModal === "add" && (
        <AddCandidate
          type={type}
          onClose={() => {
            setShowModal(null);
            setOpenMenuId(null);
          }}
          onSave={(data) => setUsers(data)}
          employeedata={null}
          updateEmployeePosition={updateEmployeePosition}
        />
      )}

      {showModal === "edit" && employeedata && (
        <EditEmployee
          onClose={() => {
            setShowModal(null);
            setOpenMenuId(null);
          }}
          onSave={(data) => setUsers(data)}
          employeedata={employeedata}
          updateEmployeePosition={updateEmployeePosition}
        />
      )}
    </section>
  );
};

export default UserTable;
