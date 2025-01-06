**MoneyMate - Personal Finance Management System**

MoneyMate is a full-stack financial management platform designed to help users efficiently manage their personal finances. It enables users to track expenses, set budgets, monitor financial goals, and gain actionable insights into their spending habits. The application focuses on providing a secure, user-friendly experience with modern design and AI-powered features.

**Features**

Core Features:

Expense Tracking: Record daily expenses with categories, descriptions, and dates.

Budget Management: Set and track budgets with real-time updates on remaining amounts.

Goals Tracking: Define savings goals and monitor progress.

Financial Reports: Generate visual insights into spending patterns using charts and graphs.

Advanced Features:

AI-Powered Insights: Leverage AI tools (e.g., Hugging Face) to provide budget recommendations and spending analysis.

Role-Based Access Control: Secure authentication with JWT and role-based permissions.

Modern UI/UX: Built with ReactJS, combining Bootstrap and Tailwind CSS for a responsive, attractive interface.

**Technology Stack**

Backend:

Spring Boot: REST API development, user authentication, and role-based access control.

MySQL: Database for managing user, expense, budget, and goal data.

Frontend:

ReactJS: Dynamic and responsive user interface.

Bootstrap & Tailwind CSS: Pre-built components and customized styling.

Chart.js: Visualization of financial insights and spending trends.

**AI Integration:**

Hugging Face: AI models for personalized financial advice and insights.

**Tools:**

Postman: API testing.

IntelliJ IDEA: Development environment.

MySQL Workbench: Database management.

Installation

Prerequisites:

Java 17+

Node.js 16+

MySQL Server

Maven

**Backend Setup:**

Clone the repository:

git clone https://github.com/yourusername/moneymate.git
cd moneymate/backend

**Configure application.properties:**

spring.datasource.url=jdbc:mysql://localhost:3306/moneymate
spring.datasource.username=<your_mysql_username>
spring.datasource.password=<your_mysql_password>
spring.jpa.hibernate.ddl-auto=update

**Build and run the backend:**

mvn clean install
mvn spring-boot:run

**Frontend Setup:**

Navigate to the frontend directory:

cd moneymate/frontend

Install dependencies:

npm install

Start the frontend:

npm start

API Endpoints

Authentication:

POST /api/auth/register: User registration.

POST /api/auth/login: User login.

Expense Management:

GET /api/expenses: Retrieve all expenses.

POST /api/expenses: Add a new expense.

PUT /api/expenses/{id}: Update an expense.

DELETE /api/expenses/{id}: Delete an expense.

Budget Management:

GET /api/budgets: Retrieve all budgets.

POST /api/budgets: Add a new budget.

Goals:

GET /api/goals: Retrieve all goals.

POST /api/goals: Add a new goal.

Screenshots

Dashboard

A modern dashboard that provides:

Summary of expenses, budgets, and goals.

Insights from financial reports.

Expense Tracker

Add, edit, or delete expenses and view categorized transactions.

Budget Planner

Set budgets with timelines and track remaining amounts.

Financial Reports

Interactive charts for spending patterns and category breakdowns.

Contribution

Contributions are welcome! Follow these steps:

Fork the repository.

Create a new branch:

git checkout -b feature-name

Commit your changes:

git commit -m "Add your message here"

Push the branch:

git push origin feature-name

Open a pull request.


