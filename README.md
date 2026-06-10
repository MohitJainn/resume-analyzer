# AI Resume Analyzer

An AI-powered Resume Analyzer built with Next.js, MongoDB, NextAuth, and Gemini AI. Users can securely upload PDF resumes, receive ATS-style feedback, track their resume scores over time, and view previous analyses through a personalized dashboard.

## Features

* User Authentication (NextAuth)
* Secure Password Hashing (bcrypt)
* PDF Resume Upload
* Resume Text Extraction
* AI-Powered Resume Analysis using Gemini AI
* ATS Score Generation
* Resume History Tracking
* ATS Score Progress Dashboard
* Resume Analysis Caching using SHA-256 Hashing
* MongoDB Atlas Database
* Responsive Dashboard UI
* Vercel Deployment

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* Next.js API Routes
* NextAuth
* MongoDB
* Mongoose

### AI

* Google Gemini API

### Authentication

* NextAuth Credentials Provider
* bcryptjs

### Deployment

* Vercel
* MongoDB Atlas

---

## How It Works

### Authentication Flow

1. User signs up with email and password.
2. Password is hashed using bcrypt before storing.
3. User logs in using NextAuth Credentials Provider.
4. JWT-based session is created.

### Resume Analysis Flow

1. User uploads a PDF resume.
2. PDF text is extracted.
3. SHA-256 hash is generated from resume content.
4. System checks MongoDB for existing analysis.
5. If analysis exists:

   * Cached result is returned.
6. Otherwise:

   * Resume is sent to Gemini AI.
   * ATS score and recommendations are generated.
   * Analysis is stored in MongoDB.

### Dashboard Analytics

Users can view:

* Current ATS Score
* Best ATS Score
* Average ATS Score
* ATS Score Progress Graph
* Resume Analysis History

---

## Database Schema

### User

```javascript
{
  name: String,
  email: String,
  password: String
}
```

### Resume

```javascript
{
  userId: ObjectId,
  fileName: String,
  extractedText: String,
  analysis: Object,
  resumeHash: String,
  createdAt: Date
}
```

---

## Caching Strategy

To reduce Gemini API calls and improve response times:

1. Extract resume text.
2. Generate SHA-256 hash.
3. Search MongoDB using the hash.
4. Return stored analysis if available.
5. Only call Gemini when no cached result exists.

Benefits:

* Faster responses
* Reduced API usage
* Lower costs
* Better scalability

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/resume-analyzer.git
```

Move into the project:

```bash
cd resume-analyzer
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
MONGO_URL=your_mongodb_connection_string

NEXTAUTH_SECRET=your_secret

NEXTAUTH_URL=http://localhost:3000

GEMINI_API=your_gemini_api_key
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Future Improvements

* Resume vs Job Description Matching
* Missing Skills Detection
* Download Analysis as PDF
* AI Resume Rewriting Suggestions
* Resume Templates
* Role-Specific ATS Scoring
* Multi-file Resume Comparison
* Email Reports

---

## Project Highlights

* Full-stack SaaS application
* Authentication and Authorization
* File Upload Handling
* PDF Parsing
* AI Integration
* Database Design
* API Development
* Caching Optimization
* Dashboard Analytics
* Cloud Deployment

---

## Author

Mohit Jain

Built to help job seekers improve resume quality and ATS performance using AI-powered insights.
