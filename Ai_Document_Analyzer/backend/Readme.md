# Document Analyzer Backend (Django + Hugging Face)

## Overview

This backend application powers the **Document Analyzer System**, an AI-driven platform that processes uploaded documents and extracts meaningful insights such as summaries, entities, and sentiment analysis.

The backend is developed using **Django** and **SQLite** database for user authentication and document storage. It integrates with **Hugging Face Inference API** to perform Natural Language Processing (NLP) tasks including summarization, Named Entity Recognition (NER), and sentiment analysis.

---

## Features

* User registration (Sign Up)
* User authentication (Login)
* Secure API key validation
* Document upload via Base64
* Text extraction from:

  * PDF
  * DOCX
  * Images (OCR)
* Automatic document summarization
* Named Entity Recognition (NER)
* Sentiment analysis
* Document metadata storage
* Processing time tracking
* REST API responses in JSON

---

## AI Models Used (Hugging Face)

### 1. Summarization Model

Model Name:

facebook/bart-large-cnn

Purpose:

Generates concise summaries from long text documents.

---

### 2. Named Entity Recognition (NER) Model

Model Name:

bmdz/bert-large-cased-finetuned-conll03-english

Purpose:

Extracts structured entities such as:

* PERSON
* ORGANIZATION
* LOCATION
* DATE
* MISC

---

### 3. Sentiment Analysis Model

Model Name:

cardiffnlp/twitter-roberta-base-sentiment-latest

Purpose:

Determines sentiment polarity:

* Positive
* Negative
* Neutral

---

## Technology Stack

### Backend Framework

* Django
* Django REST API (JSON responses)

### Database

* SQLite (default Django database)

### AI / NLP

* Hugging Face Inference API
* Transformers-based NLP models

### File Processing

* pdfplumber (PDF text extraction)
* python-docx (DOCX processing)
* Pillow (Image handling)
* pytesseract (OCR for images)

---

## Project Structure

```
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

## Installation

### Step 1 — Clone Repository

```
git clone <repository-url>
```

### Step 2 — Navigate to Backend Directory

```
cd backend
```

### Step 3 — Create Virtual Environment

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

### Step 4 — Install Dependencies

```
pip install -r requirements.txt
```

---

### Step 5 — Create .env File

Create a `.env` file in the backend root directory.

```
HUGGINGFACE_API_KEY=your_huggingface_api_key
API_KEY=your_secure_api_key
MAX_TEXT_LENGTH=2000
```

---

### Step 6 — Run Database Migrations

```
python manage.py makemigrations
python manage.py migrate
```

---

### Step 7 — Start Development Server

```
python manage.py runserver
```

Server will run at:

```
http://127.0.0.1:8000
```

---

## Database

Database Engine:

SQLite

Default File:

```
db.sqlite3
```

Stored Data:

* Users
* Uploaded documents
* Summaries
* Entities
* Sentiment results
* Processing metadata

---

## API Endpoints

### 1. Sign Up

```
POST /api/signup
```

Request Body:

```
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```
{
  "status": "success",
  "message": "User registered successfully"
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
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```
{
  "status": "success",
  "message": "Login successful"
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
  "summary": "Generated summary text",
  "entities": {
    "PERSON": ["John Doe"],
    "ORG": ["ABC Company"]
  },
  "sentiment": "Neutral"
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

## Security

* API key authentication required
* Environment variables used for secrets
* File validation before processing
* User authentication required

---

## Logging

Application logs are stored in:

```
document_ai.log
```

Logged Information:

* Upload events
* Processing time
* Errors
* API responses

---

## Future Improvements

* PostgreSQL database support
* JWT authentication
* Background processing (Celery)
* File size validation
* Rate limiting
* Docker deployment

---

## Author

Document Analyzer Backend

Django + Hugging Face AI-powered Document Processing System
