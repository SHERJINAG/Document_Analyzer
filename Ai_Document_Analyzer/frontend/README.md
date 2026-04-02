# Document Analyzer Frontend (React + Bootstrap)

## Overview

This frontend application is part of the **Document Analyzer System**, an AI-powered platform that allows users to register, log in, upload documents, and view automated analysis results such as summaries, sentiment, and extracted entities.

The application is built using **React** for the user interface and **Bootstrap** for responsive styling. It communicates with a backend API to authenticate users, upload documents, and retrieve processed results.

---

## Features

* User registration (Sign Up)
* User authentication (Login)
* Secure session-based navigation
* Document upload (PDF, DOCX, Image)
* View document analysis results
* Display summary, sentiment, and entities
* Fetch user documents from backend API
* Responsive UI using Bootstrap

---

## Application Flow

1. User lands on the **Home Page**
2. User chooses to **Login** or **Sign Up**
3. After successful authentication, user is redirected to the **Upload Page**
4. User uploads a document
5. Backend processes the document using AI
6. Frontend fetches and displays:

   * Summary
   * Sentiment
   * Entities
   * Processing details

---

## Pages / Components

### 1. Home Page

Purpose:

* Entry point of the application
* Provides navigation to Login or Sign Up

Typical Route:

```
/
```

---

### 2. Sign Up Page

Purpose:

Allows new users to create an account.

Fields:

* Username
* Email
* Password

Example Request:

```
POST /signup
```

Payload:

```
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

---

### 3. Login Page

Purpose:

Authenticates existing users.

Fields:

* Email
* Password

Example Request:

```
POST /login
```

Payload:

```
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### 4. Upload Page

Purpose:

Allows users to upload documents for AI processing.

Supported File Types:

* PDF
* DOCX
* JPEG
* PNG

User Actions:

* Select document
* Upload document
* View processing results

Displayed Results:

* File Name
* File Type
* Status
* Summary
* Sentiment
* Entities
* Text Length
* Processing Time

---

## Technology Stack

### Frontend

* React
* Bootstrap
* JavaScript
* React Router

### API Communication

* Fetch API or Axios
* REST API

---

## Project Structure

```
frontend/

src/
 ├── components/
 │    ├── Home.js
 │    ├── Login.js
 │    ├── Signup.js
 │    ├── UploadPage.js
 │    └── MyDocuments.js
 │
 ├── App.js
 ├── index.js
 └── styles.css

public/
package.json
README.md
```

---

## Installation

### Step 1 — Clone Repository

```
git clone <repository-url>
```

### Step 2 — Navigate to Project

```
cd frontend
```

### Step 3 — Install Dependencies

```
npm install
```

### Step 4 — Start Development Server

```
npm start
```

Application will run at:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file in the frontend root directory.

```
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
REACT_APP_API_KEY=YOUR_API_KEY
```

Access variables in React:

```
const API_URL = process.env.REACT_APP_API_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
```

---

## API Endpoints Used

### 1. Sign Up

```
POST /api/signup
```

Request Body:

```
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

---

### 2. Login

```
POST /api/login
```

Request Body:

```
{
  "email": "string",
  "password": "string"
}
```

---

### 3. Upload Document

```
POST /api/upload_document
```

Headers:

```
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

Request Body:

```
{
  "email": "user@example.com",
  "fileName": "resume.pdf",
  "fileType": "pdf",
  "fileBase64": "BASE64_STRING"
}
```

Response:

```
{
  "status": "success",
  "fileName": "resume.pdf",
  "summary": "Generated summary",
  "entities": {
    "PERSON": ["John Doe"],
    "ORG": ["ABC Company"]
  },
  "sentiment": "Positive"
}
```

---

### 4. Fetch User Documents

```
GET /api/my_documents
```

Query Parameter:

```
email=user@example.com
```

Response:

```
{
  "status": "success",
  "documents": [
    {
      "id": 1,
      "file_name": "resume.pdf",
      "status": "Completed",
      "summary": "Summary text",
      "sentiment": "Neutral",
      "entities": {
        "PERSON": ["John"]
      },
      "processing_time": 12.5
    }
  ]
}
```

---

## UI Framework

Bootstrap is used for:

* Responsive layout
* Forms
* Buttons
* Navigation bar
* Cards
* Tables

Install Bootstrap:

```
npm install bootstrap
```

Import Bootstrap in React:

```
import "bootstrap/dist/css/bootstrap.min.css";
```

---

## Security Notes

* API key is required for document upload
* Do not store sensitive data in frontend
* Use environment variables for configuration
* Validate file types before upload

---

## Future Improvements

* File preview
* Progress indicator
* Drag and drop upload
* Pagination for documents
* Download processed results
* Dark mode UI

---

## Author

Document Analyzer Frontend

React + Bootstrap Application for AI-based Document Processing
