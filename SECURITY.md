# Security Vulnerability Report

This document outlines the identified security vulnerabilities in the **INVOCCA** project. Each vulnerability is categorized by severity with recommended mitigation steps.

## Vulnerability Summary

| Severity | Vulnerability | Location | Status | 
| :--- | :--- | :--- | :--- |
| 🔴 **CRITICAL** | Plain-text Password Storage | `src/api/auth.js` | ⚠️ Pending Fixed |
| 🟠 **HIGH** | Prototype Pollution & ReDoS | `xlsx` dependency | ⚠️ Pending Fixed |
| 🟡 **MODERATE** | HTML Injection | `jspdf` dependency | ⚠️ Pending Fixed |
| 🟡 **MODERATE** | Sensitive Header Leak | `phin` dependency | ⚠️ Pending Fixed |
| 🟡 **MODERATE** | Insecure Token Storage | `localStorage` | ⚠️ Pending Fixed |
| 🔵 **LOW** | Disabled Content Security Policy | `index.html` | ⚠️ Pending Fixed |

---

## Detailed Findings

### 🔴 CRITICAL: Plain-text Password Storage
**Description:**
The application contains a `setPassword` helper function that stores user passwords directly in `localStorage` in plain text.
- **Location:** `src/api/auth.js:18-20`
- **Impact:** Any person with access to the browser or any script running on the page (XSS) can retrieve all stored passwords. This is a severe violation of security best practices.
- **Recommendation:** DO NOT store passwords in the browser. Use a secure backend-driven password reset flow and avoid local storage for sensitive credentials.

### 🟠 HIGH: Vulnerable Dependencies (xlsx)
**Description:**
The `xlsx` (SheetJS) dependency has known high-severity vulnerabilities:
1. **Prototype Pollution** ([GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6))
2. **Regular Expression Denial of Service (ReDoS)** ([GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9))
- **Impact:** Can lead to remote code execution or denial of service when processing malicious Excel files.
- **Recommendation:** Update to a patched version if available, or replace with a more secure alternative like `exceljs`.

### 🟡 MODERATE: HTML Injection (jspdf)
**Description:**
`jsPDF` version has an HTML Injection vulnerability in New Window paths.
- **Location:** `node_modules/jspdf`
- **Impact:** Potential for XSS when generating PDFs from user-provided HTML.
- **Recommendation:** Update `jspdf` to version `4.2.1` or higher.

### 🟡 MODERATE: Insecure Token Storage
**Description:**
Authentication tokens (`access_token`) are stored in `localStorage`.
- **Location:** `src/contexts/AuthContext.jsx`, `src/api/apiClient.js`
- **Impact:** Accessible via JavaScript, making the application vulnerable to token theft via Cross-Site Scripting (XSS).
- **Recommendation:** Use `HttpOnly` cookies for storing session tokens to prevent client-side script access.

### 🔵 LOW: Disabled Content Security Policy (CSP)
**Description:**
The CSP meta tag is commented out in the main entry file.
- **Location:** `index.html:16`
- **Impact:** Removes a critical layer of defense against XSS and data injection attacks.
- **Recommendation:** Enable and properly configure a strict CSP before deploying to production.

---

## Remediation Checklist

- [ ] Remove plain-text password storage from `src/api/auth.js`.
- [ ] Run `npm audit fix` to resolve automatically fixable vulnerabilities.
- [ ] Update or replace `xlsx` dependency.
- [ ] Enable Content Security Policy in `index.html`.
- [ ] Migrate token storage to `HttpOnly` cookies (requires backend coordination).

---

> [!CAUTION]
> This report contains sensitive information about the security posture of the application. Handle with care.
