import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, requestsRes] = await Promise.all([
        API.get("/student/books"),
        API.get("/student/my-requests")
      ]);

      const mergedBooks = booksRes.data.map(book => {
        // Look for a request where the bookId matches this book's ID
        // Handles both object and string ID formats from MongoDB
        const request = requestsRes.data.find(r => 
          (r.bookId === book._id) || (r.bookId?._id === book._id)
        );

        return {
          ...book,
          // If a request exists, use its status; otherwise, it's available
          displayStatus: request ? request.status.toLowerCase() : "available"
        };
      });

      setBooks(mergedBooks);
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestBook = async (bookId) => {
    try {
      await API.post("/student/request-book", { bookId });
      // Refresh data immediately so status changes to "PENDING"
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.message || "Failed to request book.");
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">📚 LibFlow</div>
        <button className="logout-btn" onClick={() => (window.location.href = "/login")}>
          Logout
        </button>
      </nav>

      <main className="main-content">
        <header style={{ marginBottom: "30px" }}>
          <h2>Library Catalog</h2>
          <p style={{ color: "#64748b" }}>Manage your book requests and track status.</p>
        </header>

        {loading ? (
          <div className="loading-state">Loading library...</div>
        ) : (
          <div className="table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div style={{ fontWeight: "700" }}>{book.title}</div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>{book.author}</div>
                    </td>
                    <td>{book.category || "General"}</td>
                    <td>
                      <span className={`status-badge status-${book.displayStatus}`}>
                        {book.displayStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {book.displayStatus === "available" ? (
                        <button className="request-btn" onClick={() => requestBook(book._id)}>
                          Request
                        </button>
                      ) : (
                        <button className="disabled-btn" disabled>
                          {book.displayStatus === "pending" ? "Awaiting Approval" : "Approved"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;