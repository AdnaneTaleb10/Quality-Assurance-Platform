# Quality Assurance Platform

## Project Overview

The **Quality Assurance Platform** is an interactive web application designed for evaluating and managing quality assurance processes in higher education institutions.

Users can answer structured evaluation questions, upload supporting documents as proof, and view yearly statistics. Administrators can review, validate, and provide feedback on submissions to ensure accuracy and reliability.

The platform supports multiple user roles, secure file uploads, and a comprehensive dashboard for data visualization, offering a complete workflow for institutional quality assessment and continuous improvement.

## Key Features

- **Role-Based Authentication**: Login system supporting multiple roles (Rector, Vice-Rector, Dean, Head of Department, etc.)
- **Evaluation Interface**: Answer Yes/No questions organized by quality domains
- **File Upload**: Attach PDFs or images as supporting evidence for answers
- **Admin Validation**: Review submissions, approve/reject answers, and leave feedback
- **Statistics Dashboard**: Visualize answers and submission statistics per year with interactive charts
- **Modular Design**: Easily extensible for additional domains or new features

## Technologies Used

- **Frontend**: React (JavaScript, JSX, CSS)
- **Backend**: PHP
- **Database**: MySQL
- **Charts/Visualization**: Chart.js

## Repository Structure
```
Quality-Assurance-Platform-platform/
├── frontend/ # React frontend application
│ ├── public/
│ └── src/
│ ├── components/ # Reusable React components
│ ├── pages/ # Pages (Login, Dashboard, Evaluation, etc.)
│ └── services/ # API service calls to backend
├── backend/ # PHP backend
│ ├── auth.php
│ ├── db.php
│ ├── upload.php
│ └── api/ # API endpoints grouped by feature
├── database/ # SQL scripts
│ └── schema.sql
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js and npm
- PHP 8.1+
- MySQL / MariaDB
- Web server (XAMPP, WAMP, MAMP, or Apache)

### 1. Clone the Repository
```bash
git clone https://github.com/username/qa-platform.git
cd qa-platform
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The React application will run at http://localhost:3000.

### Backend Setup
- Place the backend folder inside your web server's root directory (e.g., htdocs for XAMPP)
- Create a new MySQL database
- Import the database schema:
- Update the backend configuration (database credentials in db.php)
- Make sure the frontend API base URL matches your backend 

## Authors
- TALEB Mohamed Adnane
- GUERID Hocine
