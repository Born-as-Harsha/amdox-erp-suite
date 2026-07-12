# AMADOX ERP - Administrator Manual

This guide helps Super Admins and Admin roles configure system parameters, audit activities, and deactivate accounts.

---

## 🔒 Security Configuration
Navigate to the **System Config** dashboard panel inside the sidebar to configure the following items globally:
1. **Enable Multi-Level OTP MFA**: Forces Managers and Admins to input secondary verification codes at login.
2. **Enable Login Captcha Verification**: Adds visual verification challenges to the login page.
3. **Session Timeout Threshold**: Sets the session time limits (in minutes).
4. **API Rate Limit**: Sets the maximum queries allowed per minute to block brute-force scripts.

---

## 📝 Auditing Actions
To track security log history or database modifications:
1. Click **Audit Logs** in the sidebar.
2. Filter entries by action category (e.g. `User Login`, `OTP Login Verified`, `Settings Update`).
3. View timestamps, IP addresses, and operational details.
4. Click **Export Audit Sheet** to download a CSV backup.
