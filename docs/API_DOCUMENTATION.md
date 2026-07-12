# AMADOX ERP - API Documentation

This document describes the key REST API routes exposed by the AMADOX ERP Node.js backend. All routes are prefixed with `/api`.

---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. Register User
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Payload**:
  ```json
  {
    "employeeId": "EMP015",
    "username": "kavyanair",
    "name": "Kavya Nair",
    "email": "kavya@amadox.com",
    "phone": "7901446220",
    "password": "Password@123",
    "confirmPassword": "Password@123"
  }
  ```

### 2. Login User (Credential Step)
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Payload**:
  ```json
  {
    "emailOrUsername": "admin@amadox.com",
    "password": "Admin@123",
    "rememberMe": false
  }
  ```
* **Response (Needs OTP)**:
  ```json
  {
    "otpRequired": true,
    "email": "admin@amadox.com",
    "message": "OTP Code sent successfully. Please verify to log in."
  }
  ```

### 3. Verify OTP (Final Step)
* **Endpoint**: `POST /api/auth/verify-otp`
* **Access**: Public
* **Payload**:
  ```json
  {
    "email": "admin@amadox.com",
    "otp": "123456"
  }
  ```

---

## 📂 Secured Modules endpoints

All requests to the following endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

### 👥 Employees (`/api/employees`)
* **`GET /api/employees`**: Get all employees (Restricted to HR Manager, HR Executive, Admin, Super Admin).
* **`POST /api/employees`**: Create employee file (Restricted to HR Manager, Admin, Super Admin).
* **`PUT /api/employees/:id`**: Update details.
* **`DELETE /api/employees/:id`**: Delete profile record.

### 💰 Finance (`/api/finance`)
* **`GET /api/finance/stats`**: Get cashflow ledger reports (Restricted to Finance Manager, Accountant, Admin, Super Admin).
* **`POST /api/finance/transaction`**: Create budget item.

### 📦 Inventory (`/api/inventory`)
* **`GET /api/inventory`**: Get stock catalog (Restricted to Inventory Manager, Store Keeper, Admin, Super Admin).
* **`POST /api/inventory`**: Add product item.

### 📂 Projects (`/api/projects`)
* **`GET /api/projects`**: Get active campaigns (Restricted to Project Manager, Project Lead, Admin, Super Admin).

### 🔍 Settings (`/api/users`)
* **`GET /api/users/profile`**: Get current profile settings.
* **`PUT /api/users/profile`**: Update personal address, bio, language, or avatar.
* **`GET /api/users/audit-logs`**: Get administrative audit trails (Super Admin only).
