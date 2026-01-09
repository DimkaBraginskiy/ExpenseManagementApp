# Expense Management App

A full stack Web Application (currently under development) to enable Expenses Management.

The application involves management of cash-based payments which can be added to the system by supporting detailed info storage.

<img width="1023" height="751" alt="image" src="https://github.com/user-attachments/assets/20bfa9ff-0699-4978-be76-247daa4b51d7" />

<img width="1093" height="862" alt="Снимок экрана 2026-01-09 211201" src="https://github.com/user-attachments/assets/c9520213-2f05-41cf-ba1a-fb7c6d425bc5" />




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
<img width="1804" height="485" alt="image" src="https://github.com/user-attachments/assets/af895b5a-5ce3-4505-84bc-9a90ecc7538d" />



