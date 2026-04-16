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

* Displays all leads
* Sidebar navigation
* Lead status overview
* Filters and quick actions
* Add new lead button

---

### 🧾 Lead Management

* Create, update, delete leads
* Lead form for adding new leads
* Lead detail page with full information
* Edit lead functionality

---

### 📋 Lead Listing

* View all leads
* Filtering using:

  * Status
  * Sales Agent
  * Tags
  * Source
* Sorting:

  * Priority
  * Time to close
* URL-based filtering

---

### 💬 Comments System

* Add comments to leads
* Timestamp and author tracking
* Comments displayed on lead detail page

---

### 👨‍💼 Sales Agent Management

* View all sales agents
* Add new sales agents
* Delete agents
* Auto-update leads when agent is deleted

---

### 🔄 Lead Workflow

New → Contacted → Qualified → Proposal Sent → Closed

---

### 📈 Reports & Analytics

* Leads closed last week
* Total leads in pipeline
* Leads closed by each agent
* Status distribution charts

---

### 📂 Views

* Leads by Status
* Leads by Sales Agent
* Sorting by time to close

---

### ⚙️ Settings

* Delete leads and agents
* Toast messages on UI

---

## 🔗 API Reference

### 🧾 Leads

* **GET /leads** → Get all leads
* **GET /leads/:id** → Get lead details
* **POST /leads** → Create lead
* **PUT /leads/:id** → Update lead
* **PATCH /leads/:id** → Partial update
* **DELETE /leads/:id** → Delete lead

---

### 👨‍💼 Agents

* **GET /agents** → Get all agents
* **POST /agents** → Create agent
* **DELETE /agents/:id** → Delete agent

---

### 💬 Comments

* **POST /leads/:id/comments** → Add comment
* **GET /leads/:id/comments** → Get comments

---

### 📊 Reports

* **GET /report/last-week** → Leads closed last week
* **GET /report/pipeline** → Pipeline count

---

## 📬 Contact

📧 [tusharkumar74761@gmail.com](mailto:tusharkumar74761@gmail.com)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
