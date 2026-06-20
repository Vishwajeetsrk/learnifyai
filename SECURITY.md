# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Learnify AI, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. Email: **security@learnifyai.com** (or open a private GitHub advisory)
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours
- **Assessment** within 7 days
- **Fix or mitigation** within 30 days for critical issues
- Credit in release notes (unless you prefer anonymity)

## Security Measures

- All data encrypted at rest (Supabase)
- HTTPS enforced everywhere (HSTS with preload)
- CSP headers to prevent XSS
- Frame-ancestors DENY to prevent clickjacking
- Supabase Row Level Security (RLS) on all tables
- API keys stored as encrypted environment variables
- Rate limiting on authentication endpoints
- Input validation with Zod on all server functions

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
| Previous| No        |

## Scope

This policy covers the Learnify AI web application hosted at `learnifyaitool.vercel.app` and the associated API endpoints.
