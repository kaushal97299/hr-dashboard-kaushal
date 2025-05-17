import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../styles/leave.css";

const localizer = momentLocalizer(moment);

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    reason: '',
    fromDate: '',
    toDate: '',
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [presentEmployees, setPresentEmployees] = useState([]);

  useEffect(() => {
    const fetchPresentEmployees = async () => {
      try {
        const res = await axios.get('https://hr-dashboard-kaushal.onrender.com/api/employees/present');
        if (res.data && Array.isArray(res.data)) {
          const employeesWithNames = res.data.map(emp => ({
            ...emp,
            displayName: emp.candidateId?.name || `Employee ${emp._id}`
          }));
          setPresentEmployees(employeesWithNames);
        }
      } catch (error) {
        console.error("Error fetching present employees", error);
      }
    };
    fetchPresentEmployees();
  }, []);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('https://hr-dashboard-kaushal.onrender.com/api/Leave/leaves');
        const leaveData = Array.isArray(res.data) ? res.data : res.data.data;

        const leavesWithNames = leaveData.map(leave => {
          const employeeId = typeof leave.employeeId === 'string'
            ? leave.employeeId
            : leave.employeeId?._id || leave.employeeId;

          const employee = presentEmployees.find(emp => emp._id === employeeId);

          return {
            ...leave,
            employeeId: employeeId,
            displayName: employee?.candidateId?.name || employee?.name || `Employee ${employeeId}`
          };
        });

        setLeaves(leavesWithNames);

        const approved = leavesWithNames.filter(l => l.status === 'Approved');
        const formatted = approved.map(leave => ({
          title: `${leave.displayName} - ${leave.reason}`,
          start: new Date(leave.fromDate),
          end: new Date(leave.toDate || leave.fromDate)
        }));
        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    if (presentEmployees.length > 0) {
      fetchLeaves();
    }
  }, [presentEmployees]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append('employeeId', formData.employeeId);
      submissionData.append('reason', formData.reason);
      submissionData.append('fromDate', formData.fromDate);
      submissionData.append('toDate', formData.toDate || formData.fromDate);
      if (documentFile) {
        submissionData.append('document', documentFile);
      }

      await axios.post('https://hr-dashboard-kaushal.onrender.com/api/Leave/request', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Leave request submitted.');
      setShowModal(false);
      setDocumentFile(null);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting leave request.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://hr-dashboard-kaushal.onrender.com/api/Leave/${id}/status`, { status });
      setLeaves(prev =>
        prev.map(leave => leave._id === id ? { ...leave, status } : leave)
      );
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const filteredLeaves = Array.isArray(leaves) ? leaves.filter(leave =>
    (leave.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? leave.status === statusFilter : true)
  ) : [];

  return (
    <div className="leave-container">
      {showModal && (
        <div className="modal-overlay-leave">
          <div className="modal-content-leave">
            <button className="modal-close-leave" onClick={() => setShowModal(false)}>✕</button>
            <form onSubmit={handleSubmit} className="leave-form">
              <h3 className="form-title">Apply for Leave</h3>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select Employee</option>
                {presentEmployees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.displayName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="reason"
                placeholder="Reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="form-input"
              />
              <input
                type="file"
                name="document"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleFileChange}
                className="form-input"
              />
              <button type="submit" className="btn-add">Submit Leave</button>
            </form>
          </div>
        </div>
      )}

      <div className="top-bar">
        <div className="top-bar-left">
          <select
            className="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="search"
            className="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="top-bar-right">
          <button onClick={() => setShowModal(true)} className="btn-add">
            Add Leave
          </button>
        </div>
      </div>

      <div className="main-div">
        <div className="table-div">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.displayName}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.documentUrl ? (
                      <a
                        href={`https://hr-dashboard-kaushal.onrender.com/uploads/${encodeURIComponent(leave.documentUrl.split('uploads/')[1])}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <span className="no-doc">No File</span>
                    )}
                  </td>
                  <td>
                    {leave.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(leave._id, 'Approved')}
                          className="btn-approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(leave._id, 'Rejected')}
                          className="btn-reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calendar-div">
          <h3 className="calendar-title">Leave Calendar</h3>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaves;
