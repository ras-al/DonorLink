# 🩸 DonorLink: AI-Powered Blood Donation Management System

![DonorLink Map View](screenshots/logo.png)

**DonorLink** is a comprehensive, highly normalized Database Management System (DBMS) project designed to optimize and automate the blood donation process. It bridges the gap between Hospitals, Donors, and NGOs using a mathematical AI matching algorithm, a dynamic trust-score penalty system, and real-time geospatial mapping.

---

## 📑 Table of Contents
1. [Project Overview & Features](#-project-overview--features)
2. [Tech Stack](#-tech-stack)
3. [Database Design & Normalization (DBMS Core)](#-database-design--normalization-dbms-core)
4. [AI Engine & Business Logic](#-ai-engine--business-logic)
5. [System Screenshots & Outputs](#-system-screenshots--outputs)
6. [Installation & Setup](#-installation--setup)
7. [Team Members](#-team-members)

---

## 🚀 Project Overview & Features

DonorLink features a fully integrated, role-based architecture with four distinct user types:

* **🏥 Hospitals:** Can broadcast live emergency `BloodRequests`, manage real-time `BloodInventory`, and report donor "No-Shows" to trigger system penalties.
* **🩸 Donors:** Have a personalized dashboard to view active emergencies, accept requests (earning trust points), toggle availability, and track their donation history.
* **🏢 Organizations (NGOs):** Can schedule, manage, and track community `DonationCamps` with expected AI turnout predictions.
* **🛡️ System Admin:** A global audit dashboard to monitor active penalties, blacklisted users, and total system health.

**Smart Features:**
* **Real-time Geocoding:** Converts text addresses into exact GPS coordinates using the OpenStreetMap (Nominatim) API to plot users on a live Leaflet map.
* **JWT Authentication:** Secure, stateless login routing users instantly to their specific dashboards based on their database role.

---

## 💻 Tech Stack

* **Frontend:** React.js, Tailwind CSS, Lucide Icons, React-Leaflet (Mapping).
* **Backend:** Python, Django, Django REST Framework (DRF).
* **Database:** PostgreSQL (Hosted on Neon).
* **Geospatial API:** OpenStreetMap Nominatim & Haversine Formula.

---

## 🗄️ Database Design & Normalization (DBMS Core)

The database schema was rigorously designed to eliminate data redundancy and insertion/updation anomalies, strictly adhering to **Third Normal Form (3NF)** and **Boyce-Codd Normal Form (BCNF)**.

### 1. Entity-Relationship & Schema Highlights
* **1-to-1 Relationships:** The base `User` table holds authentication data (email, password, role). Role-specific data is separated into `DonorProfile` and `InstitutionalProfile` to prevent NULL-value sparsity.
* **1-to-Many Relationships:** A `Hospital` can create multiple `BloodRequests` and manage multiple `BloodInventory` records. 
* **Many-to-Many Resolution:** The `DonationLog` table acts as a junction entity between `DonorProfile` and `BloodRequest`, tracking the exact timestamp and status of a specific donation attempt.

### 2. Normalization Justification (3NF/BCNF)
* **1NF (Atomic Values):** All fields contain single, indivisible values (e.g., `address`, `blood_group`).
* **2NF (No Partial Dependency):** Every non-key attribute is fully functionally dependent on the primary key. For example, `patient_name` relies entirely on the `BloodRequest` ID.
* **3NF (No Transitive Dependency):** We removed transitive dependencies. For instance, instead of storing a hospital's full address inside every single `BloodRequest` row, the request links via a Foreign Key to the `User` table, ensuring hospital details are updated in only one place.

*Note: The database can be instantly populated with 50+ relational dummy records (Hospitals, NGOs, Donors, and Requests) using our custom Django Management Command: `python manage.py populate_db`.*

---

## 🧠 AI Engine & Business Logic

Rather than relying purely on manual SQL queries to match donors, DonorLink utilizes a Python-based Application Logic layer.

### 1. Smart Matching Algorithm
When a hospital broadcasts an emergency, the AI filters out donors who donated within the last 3 months (medical safety rule). It then ranks the remaining donors using a weighted mathematical formula based on the Haversine distance and the user's platform reliability:
`Match_Score = (Trust_Score * 0.7) + (Location_Proximity_Score * 0.3)`
*(For "Critical" emergencies, the weight shifts to prioritize location).*

### 2. Dynamic Trust Score & Auto-Penalty
If a donor accepts a request but fails to arrive, the hospital can report a "No-Show." This triggers a database transaction that:
1. Slashes the donor's `trust_score` by 20 points.
2. Creates an audit record in the `Penalty` table.
3. Automatically writes to the `Blacklist` table and revokes platform access if the score drops below 20.

---


## ⚙️ Installation & Setup

Follow these steps to run DonorLink locally.

### Prerequisites
* Python 3.10+
* Node.js & npm
* PostgreSQL

### Backend Setup (Django)
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: 
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt` *(Note: ensure `requests` and `sqlparse` are installed)*
5. Run database migrations: `python manage.py migrate`
6. Populate the database with test data: `python manage.py populate_db`
7. Start the server: `python manage.py runserver`

### Frontend Setup (React)
1. Open a new terminal and navigate to the root directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:5173`

**Demo Accounts (Created by populate_db):**
* Admin: Create manually via `python manage.py createsuperuser`
* Hospital: `hospital1@test.com` / `password123`
* Donor: `donor1@test.com` / `password123`
* NGO: `ngo1@test.com` / `password123`

---

## 👥 Team Members

* **Rasal Musthafa** - Project Contributor
* **Ayman Riaz** - Project Contributor
* **Faheem Shan** - Project Contributor
* **Sadil Arafath** - Project Contributor
* **Shan M A** - Project Contributor

*Developed for the Database Management Systems (DBMS) Course.*
