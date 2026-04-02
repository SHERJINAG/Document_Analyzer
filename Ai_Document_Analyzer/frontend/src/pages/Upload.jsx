import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";

export default function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [result, setResult] = useState(null);

  const [user, setUser] = useState({ username: "", email: "" });

  // Load logged-in user from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        navigate("/");
        return;
      }
      setUser(storedUser);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // Handle file selection
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    console.log("Selected file:", selectedFile.name, "Size:", selectedFile.size);

    setFile(selectedFile);
    setProgress(0);
    setResult(null);

    // Preview setup
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type === "application/pdf") {
      setPreview("pdf");
    } else {
      setPreview(null);
    }
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // remove prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
  if (!file) return alert("Select file first");
  if (!user.email) return alert("Please login first");

  try {
    setProgress(20);

    const base64File = await fileToBase64(file);

    const payload = {
      fileName: file.name,
      fileType: file.type.split("/")[1], // e.g., "pdf", "png"
      fileBase64: base64File,
      email: user.email
    };

    const response = await fetch("http://127.0.0.1:8000/api/document-analyze/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk_track2_987654321" // must match Django API_KEY
      },
      body: JSON.stringify(payload)
    });

    setProgress(70);

    const data = await response.json();
    setProgress(100);

    if (response.ok) {
      alert("Upload & Analysis Completed");
      console.log("Processed Data:", data);
      setResult(data); // data has fileName, summary, entities, sentiment
    } else {
      alert(data.message || "Upload failed");
      console.log("Upload failed response:", data);
    }

  } catch (error) {
    console.error("Upload error:", error);
    alert("Server error");
  }
};
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-wrapper">
      {/* Sidebar */}
      {showSidebar && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <div className={`sidebar bg-dark text-white p-3 ${showSidebar ? "show" : ""}`}>
        <h4 className="text-center mb-4 fw-bold">AI Docs</h4>
        <ul className="nav flex-column">
         
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/upload">📤 Upload Document</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/mydocuments">📁 My Documents</Link>
          </li>
         
          <li className="nav-item mt-4">
            <button
              className="nav-link text-danger btn btn-link text-start"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 bg-light">
        {/* Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-3">
          <button
            className="btn btn-outline-secondary me-2 d-md-none"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
          <span className="navbar-brand fw-semibold">Upload Document</span>
          <div className="ms-auto d-flex align-items-center">
            <span className="me-3 d-none d-sm-inline">Welcome, {user.username || "User"}</span>
            <i className="bi bi-person-circle fs-3"></i>
          </div>
        </nav>

        {/* Upload Area */}
        <div className="container-fluid p-3 p-md-4">
          <div
            className="card shadow-sm p-5 text-center border-2 border-dashed"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <h5 className="mb-3">📤 Drag & Drop your file here</h5>
            <p className="text-muted">or click to browse</p>
            <input
              type="file"
              className="d-none"
              ref={inputRef}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* File Details */}
          {file && (
            <div className="card shadow-sm mt-4 p-3">
              <h5 className="fw-bold">File Details</h5>
              <p><strong>Name:</strong> {file.name}</p>
              <p><strong>Type:</strong> {file.type}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>

              {preview && preview !== "pdf" && (
                <img
                  src={preview}
                  alt="preview"
                  className="img-fluid rounded border mb-3"
                  style={{ maxHeight: "200px" }}
                />
              )}

              {preview === "pdf" && (
                <div className="alert alert-info">
                  PDF preview available after upload
                </div>
              )}

              {progress > 0 && (
                <div className="progress mb-3">
                  <div className="progress-bar" style={{ width: `${progress}%` }}>
                    {progress}%
                  </div>
                </div>
              )}

              <button className="btn btn-primary" onClick={handleUpload}>Upload File</button>
            </div>
          )}

          {/* Processing Result */}
          {result && (
            <div className="card shadow-sm mt-4 p-3">
              <h5 className="fw-bold">Processing Result</h5>
              <p><strong>File:</strong> {result.fileName}</p>
              
              <p><strong>Sentiment:</strong> {result.sentiment}</p>
             

              <hr />
              <h6>Summary</h6>
              <p className="text-muted">{result.summary}</p>

              <hr />
              <h6>Entities</h6>
              <pre>{JSON.stringify(result.entities, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}