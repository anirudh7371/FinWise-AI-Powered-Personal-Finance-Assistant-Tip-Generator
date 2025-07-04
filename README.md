# 💰 FinWise – AI-Powered Personal Finance Assistant & Tip Generator

**FinWise** is a full-stack AI-based personal finance assistant that empowers users to take control of their finances with intelligent insights, budgeting support, and actionable recommendations. Using **LangChain**, **Gemini**, and rule-based logic, FinWise offers personalized financial tips, automatic expense tracking, and a clean user interface for modern money management.

---

## 🧠 Key Features

- ✅ **Personalized Financial Tips** (AI + rule-based)
- 🧾 **Receipt Scanner for Quick Entry** using OCR
- 🔁 **Recurring Transactions** for fixed monthly expenses
- 📊 **Interactive Financial Dashboard**
- 📂 **Smart Expense Categorization**
- 💡 **Context-Aware Budgeting Advice**
- 🎯 **Savings Goal Tracking**
- 📬 **Email Notifications & Tip Digests**
- 🔐 **Secure Authentication with Role-based Access**

---

## 🛠 Tech Stack

**Frontend**: Next.js (App Router), TailwindCSS, ShadCN UI  
**Backend**: Node.js, Prisma, PostgreSQL, Inngest (background workflows)  
**AI Microservice**: Python, LangChain, Gemini API  
**OCR**: Tesseract OCR (receipt parsing)

---

## 📁 Project Structure

```
finwise/
├── ai-service/              # Python-based AI + OCR service
├── app/                     # Next.js App Router (auth, dashboard, etc.)
├── components/              # UI Components
├── actions/                 # Server-side actions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── emails/                  # Email templates
├── hooks/, lib/, data/      # Helpers and utilities
├── requirements.txt         # Python AI service dependencies
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/anirudh7371/Finwise.git
cd finwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

```bash
npx prisma generate
npx prisma migrate dev
```

Make sure PostgreSQL is configured in your `.env`.

### 4. Start the App

```bash
npm run dev
```

### 5. Run the Python AI + OCR Service

```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## 🧾 Receipt Scanner

The **Add Transaction** interface supports uploading receipts.

* Uses **Tesseract OCR** to extract text
* Auto-fills merchant name, date, and amount
* Improves user experience for logging real-world expenses

---

## 🔁 Recurring Transactions

Users can mark a transaction as **recurring** with:

* Frequency: Daily, Weekly, Monthly
* Auto-population into budget
* Shown in upcoming expenses on dashboard

---

## 🤖 AI Financial Tips Engine

* Powered by **LangChain + Gemini**
* Combines:
  * Rule-based logic (50/30/20, savings ratio, etc.)
  * Natural language prompt engineering
  * Personalized insights based on patterns

---

## 📊 Dashboard Insights

* Income vs. Expenses
* Savings & Budget breakdowns
* Top spending categories
* Progress toward financial goals

---

## 📬 Email Notifications

Email system sends:

* Weekly/monthly summaries
* AI-generated finance tips
* Budget breach alerts

---

## 📈 Future Roadmap

* 📱 Mobile App (React Native)
* 🔌 Bank Integration (Plaid, Yodlee)
* 🔎 AI-driven Investment Advice
* 📉 Predictive Budget Forecasting
* 👨‍👩‍👧 Shared Family Budgeting

---

## 🔒 Security & Compliance

* Secure JWT-based authentication
* Encrypted database fields for sensitive data
* GDPR-aligned data handling

---

## 📜 License

MIT License © 2025 Anirudh & Team

---

## 🧑‍💻 Authors

* [Anirudh](https://github.com/anirudh7371)

---

> "FinWise – Because everyone deserves a smart financial advisor."