# AMADOX ERP - Testing Report

This report summarizes unit, functional, and layout integration test results.

---

## 🧪 Test Case Coverage

| Test ID | Scenario Description | Tested Role / Component | Status |
| :--- | :--- | :--- | :--- |
| **TC-001** | Multi-credential phone login lookup (`7901446220`) | Super Admin / Accountant | **`PASS`** |
| **TC-002** | Visual Captcha block verification checks | All Login scopes | **`PASS`** |
| **TC-003** | Dynamic sidebar menu list items fit-to-height scroll checks | Super Admin | **`PASS`** |
| **TC-004** | Profile context state updates upon settings profile save | All Roles | **`PASS`** |
| **TC-005** | Form input alignment & responsive screen fitting on mobile | Login / Register screens | **`PASS`** |
| **TC-006** | JWT Token expiration auto-logout checks | Auth guards | **`PASS`** |
| **TC-007** | Forbidden 403 blocks on illegal backend API queries | HTTP middlewares | **`PASS`** |
