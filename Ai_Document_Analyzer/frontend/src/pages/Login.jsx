import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "http://127.0.0.1:8000/login/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (response.ok) {

    // Save user data
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    alert("Login successful");

    navigate("/upload");

  } else {
    alert(data.error);
  }
};

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">

        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary text-white">
          <div className="text-center p-5">
            <h1 className="fw-bold mb-3">AI Document Analysis</h1>
            <p className="lead">
              Securely upload, analyze, and manage your documents with powerful AI
              insights.
            </p>
          </div>
        </div>


        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}>
            <h3 className="text-center mb-4 fw-bold">Login</h3>
            <form onSubmit={handleLogin}>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-grid mb-3">
                <button className="btn btn-primary btn-lg">
                  Login
                </button>
              </div>

            </form>

            <div className="text-center">
              <span>Don't have an account? </span>
              <a href="/signup" className="text-primary fw-semibold">
                Sign Up
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}