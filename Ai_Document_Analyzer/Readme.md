# Document Analyzer System (Full Stack)

## Overview

The **Document Analyzer System** is a full-stack web application that allows users to upload documents and automatically analyze their content using Artificial Intelligence (AI). The system extracts text, generates summaries, identifies named entities, and determines sentiment from uploaded files.

This application consists of two main components:

* **Frontend**: Built with React and Bootstrap for user interaction
* **Backend**: Built with Django for API services, authentication, document processing, and AI integration

The system integrates with the **Hugging Face Inference API** to perform Natural Language Processing (NLP) tasks.

---

## System Architecture

Frontend (React + Bootstrap)
|
|
v
Backend API (Django)
|
|
v
Hugging Face AI Models

---

## Key Features

### User Management

* User Sign Up
* User Login
* Session-based authentication
* SQLite database storage

### Document Processing

* Upload documents (PDF, DOCX, Images)
* Automatic text extraction
* AI-based document summarization
* Named Entity Recognition (NER)
* Sentiment analysis
* Processing time tracking

### Results Display

* Summary generation
* Sentiment classification
* Entity extraction (key-value pairs)
* Document history view

---

## AI Models Used (Hugging Face)

### Summarization Model

Model:

facebook/bart-large-cnn

Purpose:

Generates concise summaries from long documents.

---

### Named Entity Recognition Model

Model:

bmdz/bert-large-cased-finetuned-conll03-english

Purpose:

Extracts entities such as:

* PERSON
* ORGANIZATION
* LOCATION
* DATE
* MISC

---

### Sentiment Analysis Model

Model:

cardiffnlp/twitter-roberta-base-sentiment-latest

Purpose:

Classifies sentiment into:

* Positive
* Negative
* Neutral

---

## Technology Stack

### Frontend

* React
* Bootstrap
* JavaScript
* React Router
* Fetch API / Axios

### Backend

* Django
* Django REST API
* SQLite Database

### AI / NLP

* Hugging Face Inference API
* Transformers Models

### File Processing

* pdfplumber
* python-docx
* Pillow
* pytesseract

---

## Application Workflow

1. User opens the Home Page
2. User signs up with:

   * Username
   * Email
   * Password
3. User logs in using the same credentials
4. User uploads a document
5. Backend processes the document
6. AI models analyze the content
7. Frontend displays:

   * Summary
   * Sentiment
   * Entities
   * Processing details

---

## Project Structure

```
document-analyzer-system/

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
 └── index.js

backend/

manage.py

project/
 ├── settings.py
 ├── urls.py
 └── wsgi.py

app/
 ├── models.py
 ├── views.py
 ├── utils.py
 ├── urls.py
 └── migrations/

media/

.env
requirements.txt
README.md
```

---

## Installation Guide

### Step 1 — Clone Repository

```
git clone <repository-url>
```

---

## Backend Setup (Django)

### Create Virtual Environment

```
python -m venv venv
```

Activate environment:

Windows:

```
venv\\Scripts\\activate
```

Linux / Mac:

```
source venv/bin/activate
```

---

### Install Dependencies

```
pip install -r requirements.txt
```

---

### Create .env File

```
HUGGINGFACE_API_KEY=your_huggingface_api_key
API_KEY=your_secure_api_key
MAX_TEXT_LENGTH=2000
```

---

### Run Database Migrations

```
python manage.py makemigrations
python manage.py migrate
```

---

### Start Backend Server

```
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## Frontend Setup (React)

Navigate to frontend directory:

```
cd frontend
```

Install dependencies:

```
npm install
```

---

### Create Frontend .env File

```
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
REACT_APP_API_KEY=YOUR_API_KEY
```

---

### Start Frontend Server

```
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## API Endpoints

### Sign Up

```
POST /api/signup
```

---

### Login

```
POST /api/login
```

---

### Upload Document

```
POST /api/upload_document
```

Headers:

```
x-api-key: YOUR_API_KEY
```

---

### Fetch Documents

```
GET /api/my_documents?email=user@example.com
```

---

## Example Output

```
{
  "status": "success",
  "fileName": "resume.pdf",
  "summary": "Generated summary text",
  "sentiment": "Neutral",
  "entities": {
    "PERSON": ["John Doe"],
    "ORG": ["ABC Company"]
  }
}
```

---

## Database

Database Used:

SQLite

File:

```
db.sqlite3
```

Stored Data:

* Users
* Documents
* Summaries
* Entities
* Sentiment
* Processing Time

---

## Security

* API key authentication
* Environment variable configuration
* Input validation
* File type validation

---

## Future Enhancements

* JWT Authentication
* PostgreSQL database
* Background processing (Celery)
* Docker deployment
* Cloud storage integration
* Role-based access control

---

## Author

Full Stack Document Analyzer System

React Frontend + Django Backend + Hugging Face AI Integration
