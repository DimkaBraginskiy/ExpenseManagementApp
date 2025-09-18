# Expense Management App

A full stack Web Application (currently under development)

The application involves management of cash-based payments which can be added to the system by supporting detailed info storage.

## Table of Contents
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)

## Tech Stack
### Backend

- ASP .NET Core
  
#### Database

- PostgreSQL
- Entity Framework Core

#### Security

- .NET Core Identity
- Json Web Token Authorization (JWT)

### Frontend

- React

##  API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Auth/regisgter` | Register a new User | 
| POST | `/api/Auth/login` | Login to User profile | 

During login the User is given both Access Token and Refresh Token.

In case of Access Token expiration, a new one will be given during Refresh Token exchange process.


### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create new expense |
| GET | `/api/expenses/users/{id}` | Get all expenses based on User Id |

