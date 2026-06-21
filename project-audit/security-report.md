# Security Report

- **Authentication**: JWT secured via Supabase Auth.
- **Authorization**: Role checks enforced via middleware and `useAuth` hooks.
- **RBAC**: Protected routes strictly managed by TanStack Router `beforeLoad`.
- **API Security**: Node endpoints check `process.env` dynamically.
- **Secrets**: Checked. No leaked secrets in repository.
