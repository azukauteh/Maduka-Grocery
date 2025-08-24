

<div align="center" style="max-width: 100%;">
  <img src="./images/madukalogo.jpeg" alt="Maduka Grocery Logo" style="width: 100%; height: auto;">
</div>

# 🛒 Maduka Grocery  

Maduka Grocery is a modern, AI-powered grocery store management platform.  
It offers a seamless shopping experience while also integrating automated AI code reviews for developers contributing to this project.  
Whether you're looking for fresh produce, packaged goods, or African specialty ingredients, Maduka Grocery has you covered.  
This repository powers the backend and frontend for the grocery store application and integrates a custom OpenAI-powered GitHub Actions workflow that reviews code changes automatically.


---

## 🚀 Features

- 🥦 Grocery Inventory Management — Organize, manage, and track grocery items.
- 🛍 Product Catalog — Supports both local and international product listings.
- 🌍 African Ingredients Support — Curated selection of African groceries.
- 🤖 AI-Powered Code Review — Integrated OpenAI-powered reviewer for pull requests.
- 📦 Full-Stack Project — Includes React frontend and Node/Express backend.
- 🔒 Secure Environment Configuration — Supports `.env` for sensitive credentials.

---

## 🛠️ Tech Stack

. Frontend:  JavaScript, HTML, CSS  
. Backend:Node.js, Express.js  
. Database:MongoDB (optional integration)  
. AI Review Engine: OpenAI GPT API  
. CI/CD:GitHub Actions  
. Version Control: Git & GitHub  

---

## 📂 Project Structure

Maduka-Grocery/

├── client/  
              
├── server/
              
├── git\_utils/
          
│   ├── ai\_reviewer.py

│   ├── workflows/

│   │   └── run\_ai\_review\.py
│   └── test/
         
├── images/

├── requirements.txt
     
├── package.json
       
├── README.md
          
└── .github/

└── workflows/

└── ai\_review\.yml 


---

## ⚡ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd Maduka-Grocery
````

### 2️⃣ Install Dependencies

#### Backend:

```bash
npm install
```

#### Frontend:

```bash
cd client
npm install
```

### 3️⃣ Start the Development Servers

Frontend:

```bash
npm start
```

Backend:

```bash
npm run server
```

---

## 🔧 Environment Setup

Create a .env file in the root of the project and configure the following variables:

```ini
# GitHub integration
GITHUB_TOKEN=<your_github_token>
GITHUB_REPOSITORY=azukauteh/Maduka-Grocery

# OpenAI integration
OPENAI_API_KEY=<your_openai_api_key>

# Local testing (optional)
PR_NUMBER=23
```

> Note:
> For live GitHub Actions AI reviews, you don’t need to set PR\_NUMBER manually.
> It’s dynamically fetched from the pull request events.

---

## 🤖 AI Code Review Workflow

We’ve integrated an *OpenAI-powered GitHub Actions workflow to automatically review code whenever you open or update a pull request.

### How It Works:

1. Push code changes to your feature branch.
2. Open a Pull Request against `magnificent` or `main`.
3. GitHub Actions triggers the `ai_review.yml` workflow.
4. The AI reads your diff and posts a detailed review in the PR comments.

---

## 🧪 Running Tests

We use pytest for Python tests and Jest for frontend testing.

```bash
# Run backend tests
pytest

# Run frontend tests
cd client
npm test
```

## 📜 License

This project is licensed under the **MIT License**.
Feel free to use, modify, and distribute it.

---

## 💡 Author

Maduka Grocery Team
Built with ❤️ to bring you a modern grocery shopping and development experience.

```



