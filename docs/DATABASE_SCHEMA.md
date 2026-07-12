# AMADOX ERP - MongoDB Database Schema

The AMADOX ERP Suite stores structural details inside MongoDB database clusters using Mongoose ODM schemas.

---

## 1. User Schema (`User`)
Stores enterprise account credentials, preferences, OTP codes, and login lock properties.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `employeeId` | String | Required, Unique | ERP employee identifier (e.g. EMP001) |
| `username` | String | Required, Unique | login credential handle |
| `email` | String | Required, Unique | Corporate email contact |
| `phone` | String | Default: `""` | User phone contact (Lookup allowed) |
| `password` | String | Required | Salted Bcrypt password hash |
| `role` | String | Default: `"Employee"` | Active authorization role (1 of 13 roles) |
| `profilePicture` | String | Default: `""` | Disk path to uploaded avatar |
| `otpCode` | String | Default: `""` | Active login authentication OTP |
| `otpExpires` | Date | - | Expiration check for OTP |
| `status` | String | `Active`, `Inactive` | Deactivation lockout switch |

---

## 2. Employee Schema (`Employee`)
HR registry of professional details, emergency parameters, and attendance metrics.

* **Fields**: `employeeId`, `fullName`, `email`, `phone`, `department`, `designation`, `dateOfJoining`, `salary`, `status` ("Active", "Leave", "Terminated").

---

## 3. Inventory Schema (`Product`)
Warehouse registry tracking categorizations and asset quantities.

* **Fields**: `sku`, `name`, `category`, `quantity`, `unit`, `price`, `supplier`, `minStockLevel`.

---

## 4. Finance Schema (`Transaction`)
Ledger sheets logging treasury inflow and outflow budgets.

* **Fields**: `transactionId`, `type` ("Income", "Expense"), `category`, `amount`, `date`, `description`, `referenceNo`.

---

## 5. Audit Log Schema (`AuditLog`)
Operational security logging panel.

* **Fields**: `userId` (Ref: User), `action` (e.g., "User Login"), `details`, `ipAddress`, `timestamp`.
