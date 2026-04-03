import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://document-analyzer-backend-wx2t.onrender.com/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: fullName,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful. Please login.");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-success text-white">
          <div className="text-center p-5">
            <h1 className="fw-bold mb-3">
              Create Your Account
            </h1>
            <p className="lead">
              Join the AI-powered document system.
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="card shadow-lg p-4"
            style={{
              width: "100%",
              maxWidth: "450px",
              borderRadius: "16px",
            }}
          >
            <h3 className="text-center mb-4 fw-bold">
              Sign Up
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button className="btn btn-success btn-lg">
                  Create Account
                </button>
              </div>
            </form>
            <div className="text-center">
              <span>Already have an account? </span>
             <Link to="/login" className="text-primary fw-semibold">
  Sign Up
</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
