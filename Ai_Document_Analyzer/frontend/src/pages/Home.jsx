import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold" href="#">
          AI Document Analyzer
        </a>

        <div className="ms-auto">
  <Link to="/login" className="btn btn-outline-light me-2">
    Login
  </Link>

  <Link to="/signup" className="btn btn-primary">
    Get Started
  </Link>
</div>
      </nav>

      {/* Hero Section */}
      <section className="text-center text-white d-flex align-items-center justify-content-center"
        style={{
          height: "80vh",
          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        }}
      >
        <div>
          <h1 className="display-4 fw-bold">
            Smart AI Document Analysis Platform
          </h1>

          <p className="lead mt-3">
            Upload, analyze, and extract insights from documents using
            Artificial Intelligence in seconds.
          </p>

            <Link to="/signup" className="btn btn-light btn-lg mt-4">
                Upload Your First Document
            </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">Core Features</h2>

        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title">Document Upload</h4>
                <p className="card-text">
                  Easily upload PDF, Image, and Word documents securely.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title">AI Text Extraction</h4>
                <p className="card-text">
                  Automatically extract text and structured data from
                  documents.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="card-title">Analytics Dashboard</h4>
                <p className="card-text">
                  View insights, statistics, and performance analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-3">
              <h2 className="fw-bold">10K+</h2>
              <p>Documents Processed</p>
            </div>

            <div className="col-md-3">
              <h2 className="fw-bold">99%</h2>
              <p>Accuracy Rate</p>
            </div>

            <div className="col-md-3">
              <h2 className="fw-bold">500+</h2>
              <p>Active Users</p>
            </div>

            <div className="col-md-3">
              <h2 className="fw-bold">24/7</h2>
              <p>System Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">How It Works</h2>

        <div className="row text-center">
          <div className="col-md-4">
            <div className="p-4">
              <h5 className="fw-bold">1. Upload Document</h5>
              <p>Select and upload your document securely.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4">
              <h5 className="fw-bold">2. AI Processing</h5>
              <p>The system analyzes and extracts information.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4">
              <h5 className="fw-bold">3. View Insights</h5>
              <p>Get reports, summaries, and analytics instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="text-center text-white py-5"
        style={{ background: "#0d6efd" }}
      >
        <h2 className="fw-bold">Ready to Analyze Your Documents?</h2>

        <p className="mt-3">
          Start using our AI-powered document analysis platform today.
        </p>

        <Link to="/signup" className="btn btn-light btn-lg mt-4">
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © 2026 AI Document Analysis System | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}