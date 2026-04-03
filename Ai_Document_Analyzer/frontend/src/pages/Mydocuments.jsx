import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

export default function MyDocuments() {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState({ username: "", email: "" });
  const [selectedDoc, setSelectedDoc] = useState(null); // modal document

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(storedUser);
    fetchDocuments(storedUser.email);
  }, [navigate]);

  const fetchDocuments = async (email) => {
    try {
      const response = await fetch(
        `https://document-analyzer-backend-wx2t.onrender.com/my-documents/?email=${email}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setDocuments(data.documents || []);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.log(error);
      setDocuments([]);
    }
  };



  

  const filteredDocs = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === "Completed") return "bg-success";
    if (status === "Processing") return "bg-warning text-dark";
    if (status === "Failed") return "bg-danger";
    return "bg-secondary";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      {/* Mobile Overlay */}
      {showSidebar && (
        <div className="sidebar-overlay d-md-none" onClick={() => setShowSidebar(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar bg-dark text-white p-3 ${showSidebar ? "show" : ""}`}>
        <h4 className="text-center mb-4 fw-bold">AI Docs</h4>
        <ul className="nav flex-column">
          
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/upload">📤 Upload</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/mydocuments">📂 My Documents</Link>
          </li>
          <li className="nav-item mt-4">
            <button className="nav-link text-danger btn btn-link" onClick={handleLogout}>logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 bg-light">
        {/* Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-3">
          <button className="btn btn-outline-secondary me-2 d-md-none" onClick={() => setShowSidebar(true)}>☰</button>
          <span className="navbar-brand fw-semibold">My Documents</span>
          <div className="ms-auto">Welcome, {user.username}</div>
        </nav>

        <div className="table-responsive">
  <table className="table table-striped table-hover table-bordered table-sm">
    <thead className="table-dark">
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredDocs.length === 0 && (
        <tr>
          <td colSpan="5" className="text-center text-muted">
            No documents found
          </td>
        </tr>
      )}
      {filteredDocs.map((doc) => (
        <tr key={doc.id}>
          <td>{doc.file_name}</td>
          <td>{doc.file_type}</td>
          <td>
            <span className={`badge ${getStatusBadge(doc.status)}`}>
              {doc.status}
            </span>
          </td>
          <td>{doc.uploaded_at}</td>
          <td>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setSelectedDoc(doc)}
              >
                View
              </button>
              {/* Add more action buttons here if needed */}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>

      {/* Modal to view document details */}
      {selectedDoc && (
        <div className="modal show d-block" tabIndex="-1" onClick={() => setSelectedDoc(null)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedDoc.file_name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDoc(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Type:</strong> {selectedDoc.file_type}</p>
                <p><strong>Status:</strong> {selectedDoc.status}</p>
                <p><strong>Uploaded At:</strong> {selectedDoc.uploaded_at}</p>
                <p><strong>Text Length:</strong> {selectedDoc.text_length}</p>
                <p><strong>Processing Time:</strong> {selectedDoc.processing_time} seconds</p>
                <p><strong>Summary:</strong></p>
                <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f8f9fa", padding: "10px" }}>
                  {selectedDoc.summary || "-"}
                </pre>
                <p><strong>Sentiment:</strong> {selectedDoc.sentiment}</p>
                <p>
  <strong>Entities:</strong>{" "}
  {selectedDoc.entities && Object.keys(selectedDoc.entities).length > 0 ? (
    Object.entries(selectedDoc.entities).map(([type, values]) => (
      <span key={type}>
        <strong>{type}:</strong> {values.join(", ")}{" "}
      </span>
    ))
  ) : (
    "-"
  )}
</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
