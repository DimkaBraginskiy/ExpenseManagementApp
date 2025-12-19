# Expense Management App

A full stack Web Application (currently under development) to enable Expenses Management.

The application involves management of cash-based payments which can be added to the system by supporting detailed info storage.

## Table of Contents
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)

## Tech Stack
- **Backend Framework:** ASP .NET Core
- **Database management:** Entity Framework Core
- **Database:** PostgreSQL
- **Authentication & Authorization:** .NET Core Identity, Json Web Token Authorization (JWT)
- **Frontend Framework:** React

##  API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Auth/regisgter` | Register a new User | 
| POST | `/api/Auth/login` | Login to User profile | 

During login the User is given both Access Token and Refresh Token.

In case of Access Token expiration, a new one will be given during Refresh Token exchange process.


### Expenses
## Assuming that we provide userId by default
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create new expense |
| GET | `/api/expenses/users/{id}` | Get all expenses based on User Id |
| GET | `/api/expenses/caregory/{categoryName}` | Get all categories based on provided category name |
| GET | `/api/expenses/dateRange?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Get all categories by specified DateTimeOffset range |

