import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./StudentDashboard.css";

const LibrarianDashboard = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, requestsRes] = await Promise.all([
        API.get("/librarian/pending-students"),
        API.get("/librarian/requests")
      ]);
      setPendingStudents(studentsRes.data);
      setBookRequests(requestsRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type, action) => {
    try {
      const url = type === 'student' 
        ? `/librarian/approve-student/${id}` 
        : `/librarian/${action}-request/${id}`;
      
      await API.put(url);
      alert("Success!");
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  if (loading) return <div className="loading-state">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">📚 LibFlow | Librarian</div>
        <button className="logout-btn" onClick={() => window.location.href = "/login"}>Logout</button>
      </nav>

      <main className="main-content">
        {/* STUDENT APPROVALS */}
        <section style={{ marginBottom: "40px" }}>
          <h3>Pending Students</h3>
          <div className="table-wrapper">
            <table className="book-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingStudents.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>
                      <button className="request-btn" onClick={() => handleAction(s._id, 'student')}>
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* BOOK REQUESTS */}
        <section>
          <h3>Issue Requests</h3>
          <div className="table-wrapper">
            <table className="book-table">
              <thead>
                <tr><th>Book</th><th>Student</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bookRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      {/* Safety Check: If bookId is an object, show title. Otherwise show ID */}
                      <strong>{req.bookId?.title || "Book ID: " + (req.bookId || "N/A")}</strong>
                    </td>
                    <td>
                      {/* Safety Check: If studentId is an object, show name */}
                      {req.studentId?.name || "User ID: " + (req.studentId || "N/A")}
                    </td>
                    <td>
                      <span className={`status-badge status-${req.status?.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === "PENDING" && (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button 
                            className="request-btn" 
                            style={{background: "#10b981"}} 
                            onClick={() => handleAction(req._id, 'book', 'approve')}
                          >
                            ✓
                          </button>
                          <button 
                            className="logout-btn" 
                            style={{padding: "6px 12px"}}
                            onClick={() => handleAction(req._id, 'book', 'reject')}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LibrarianDashboard;