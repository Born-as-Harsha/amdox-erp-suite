# AMADOX ERP - Security Audit Report

AMADOX Technologies deploys a Zero-Trust role protection architecture to secure sensitive database models.

---

## 🔒 Implemented Security Protocols
1. **Multi-Factor Authentication (MFA)**:
   - Dynamic 6-digit OTP verification required for high-privileged roles.
   - Restores sessions via signed remember-me tokens.
2. **Brute Force Defense**:
   - Visual Captchas powered by React 2D Canvas context rendering (noisy pixel dots, distorted characters).
   - Global rate-limit toggles inside System Configuration logs.
3. **Password Encryption**:
   - Salted and hashed using `bcryptjs` (10 rounds).
4. **Backend Authorization Gates**:
   - Dynamic `authorizeRoles` route middleware blocking unauthorized token scopes. Returns `403 Forbidden` on breach attempts.
