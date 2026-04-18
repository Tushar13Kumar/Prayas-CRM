# 🚀 Anvaya CRM

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Status](https://img.shields.io/badge/Project-Active-success)

---

A **full-stack CRM application** to manage leads, sales agents, and business workflows efficiently.

---

## 🌐 Live Demo

🔗 https://anvaya-crm-kohl.vercel.app/

---

## ⚡ Quick Start

```bash
git clone https://github.com/Tushar13Kumar/frontend-meetups.git
cd frontend-meetups
npm install
npm run dev
```

---

## ⚙️ Environment Setup

### 📁 Backend Setup

1. Navigate to backend project folder

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Add dotenv in your backend entry file:

```js
require("dotenv").config();
```

5. Start backend server:

```bash
node index.js
```

---

### 🌐 Frontend Setup

1. Navigate to frontend project folder

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

---

### 🔗 Connecting Frontend & Backend

* Ensure backend runs on:
  `http://localhost:5000`

* Set API base URL in frontend:

```js
const BASE_URL = "http://localhost:5000";
```

---

## 🛠️ Tech Stack

### Frontend

* React JS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Others

* Chart.js
* REST APIs

---

## ✨ Features

### 📊 Dashboard

* Displays all leads in a structured dashboard view
* Provides sidebar navigation for easy access
* Shows lead status overview with clear visual indicators
* Enables quick filtering and user actions
* Allows users to add new leads directly

---

### 🧾 Lead Management

* Allows users to create, update, and delete leads
* Provides a form interface to add new leads
* Displays detailed information for each lead
* Enables seamless editing of lead data

---

### 📋 Lead Listing

* Displays all leads in an organized list view
* Supports filtering based on:

  * Status
  * Sales Agent
  * Tags
  * Source
* Enables sorting by priority and time to close
* Implements URL-based filtering for better usability

---

### 💬 Comments System

* Allows users to add comments to leads
* Stores author and timestamp for each comment
* Displays comments within the lead detail page

---

### 👨‍💼 Sales Agent Management

* Displays a list of all sales agents
* Allows users to add new sales agents
* Enables deletion of sales agents
* Automatically updates related leads when an agent is removed

---

### 🔄 Lead Workflow

* Implements a complete lead lifecycle:
  New → Contacted → Qualified → Proposal Sent → Closed

---

### 📈 Reports & Analytics

* Displays leads closed in the last 7 days
* Shows total leads currently in the pipeline
* Provides performance insights for each sales agent
* Visualizes lead status distribution using charts

---

### 📂 Views

* Groups leads by status
* Groups leads by sales agent
* Supports sorting by time to close

---

### ⚙️ Settings

* Allows deletion of leads and agents
* Displays toast notifications for user actions

---

## 🔗 API Reference

### 🧾 Leads

#### GET /leads

Retrieves all leads (supports query-based filtering).

**Sample Response:**

```json
[
  {
    "_id": "123",
    "name": "Company ABC",
    "status": "New"
  }
]
```

---

#### GET /leads/:id

Retrieves details of a specific lead.

**Sample Response:**

```json
{
  "_id": "123",
  "name": "Company ABC",
  "status": "New"
}
```

---

#### POST /leads

Creates a new lead.

---

#### PUT /leads/:id

Updates an existing lead.

---

#### PATCH /leads/:id

Partially updates a lead.

---

#### DELETE /leads/:id

Deletes a lead.

---

### 👨‍💼 Agents

#### GET /agents

Retrieves all sales agents.

---

#### POST /agents

Creates a new sales agent.

---

#### DELETE /agents/:id

Deletes a sales agent.

---

### 💬 Comments

#### POST /leads/:id/comments

Adds a comment to a lead.

---

#### GET /leads/:id/comments

Retrieves all comments for a lead.

---

### 📊 Reports

#### GET /report/last-week

Retrieves leads closed in the last 7 days.

---

#### GET /report/pipeline

Retrieves total leads currently in the pipeline.

---

## 📬 Contact

📧 [tusharkumar74761@gmail.com](mailto:tusharkumar74761@gmail.com)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
