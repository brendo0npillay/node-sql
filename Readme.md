# Visitor manager

A backend Node.js app for managing visitors, storing visitor details in a PostgreSQL database. Users can add, view, update, and delete visitor records via a web form, with validations and proper error handling.

## **Features**

- Add new visitors with details: name, age, assistant, date, time, comments
- View all visitors or a single visitor
- Update visitor info safely
- Delete a single visitor or all visitors
- Input validation for names, dates, times, age, and comments
- Auto-creation of database table if it doesn’t exist
- Dockerized PostgreSQL setup with Adminer for database management
- Thank-you page rendered with Pug template after submission

## **Technologies Used**

- Node.js & Express.js
- PostgreSQL
- Docker & Docker Compose
- Pug templating engine
- dotenv for environment variables
- Body-parser for form parsing
- Jasmine (unit testing)

## **Installation**
1. Clone the repository:
    ```bash
    git clone <repo-url>

2. **Install dependencies**
    ```bash
    npm install

3. **Set .env variables for DB_USER, DB_PASSWORD, DB_PORT**

4. **Start docker**
    ```bash
    docker-compose up

5. **Launch the live server for the frontend**
    ```bash
    npm start