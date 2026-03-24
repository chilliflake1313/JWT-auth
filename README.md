# JWT Auth Boilerplate (OTP + Refresh Tokens + Email Flow)

Implements JWT authentication with access/refresh tokens, OTP-based email verification, and password recovery flow.

This is a minimal, production-style authentication starter built with Node.js, Express, and TypeScript.

Designed for:
- developers building SaaS apps
- students learning auth systems
- projects needing ready-to-use JWT + OTP flow

⚠️ This project is a starter template.

It is NOT production-ready out of the box.

⚠️ Email functionality is limited in development mode and will not send OTPs to real email providers like Gmail or Proton Mail without domain verification.

Why this project exists:

Authentication is one of the most repeated backend problems.
This boilerplate removes the need to build it from scratch.

A reusable authentication boilerplate with:
- JWT access and refresh tokens
- Signup with email OTP verification
- Login with email and password
- Forgot password with OTP-based reset
- Mailtrap integration for email delivery
- Minimal frontend pages for quick testing

This project is designed so anyone can clone it and adapt it to their own app.

## Auth Flow

Signup:
email -> OTP -> verify -> account created -> tokens issued

Login:
email + password -> tokens issued

Refresh:
refresh token -> validated -> new access token

Password Reset:
email -> OTP -> verify -> password updated

## Features

- `POST /auth/signup` sends OTP to email
- `POST /auth/verify-email` verifies OTP and creates account
- `POST /auth/login` returns `accessToken` + `refreshToken`
- `POST /auth/refresh` returns a new access token
- `POST /auth/forgot-password` sends reset OTP
- `POST /auth/reset-password` resets password with OTP
- `POST /auth/logout` invalidates current refresh token
- `GET /auth/me` protected route sample

## Project Structure

```text
.
|-- public/
|   |-- login.html
|   `-- signup.html
|-- src/
|   |-- middleware/
|   |   |-- auth.middleware.ts
|   |   |-- errorHandler.ts
|   |   `-- rateLimiter.ts
|   |-- routes/
|   |   `-- auth.routes.ts
|   |-- services/
|   |   |-- auth.service.ts
|   |   |-- mail.service.ts
|   |   `-- token.service.ts
|   |-- app.ts
|   `-- server.ts
|-- .env.example
|-- package.json
|-- tsconfig.json
`-- README.md
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Fill values in `.env`:

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
MAILTRAP_FROM=noreply@yourapp.local
```

4. Run development server:

```bash
npm run dev
```

5. Open frontend test pages:
- `http://localhost:3000/login.html`
- `http://localhost:3000/signup.html`

## Scripts

- `npm run dev` - run server in TypeScript mode
- `npm run build` - compile to `dist/`
- `npm run start` - run compiled server
- `npm run typecheck` - TypeScript type check only

## How The Flow Works

### Signup
1. User submits email and password
2. Server validates password length
3. Password is hashed with `bcrypt`
4. OTP is generated and emailed
5. User submits OTP to verify email
6. Account is created and JWT tokens are returned

### Login
1. User submits email and password
2. Password hash is verified with `bcrypt.compare`
3. Access token (15m) and refresh token (7d) are returned

### Forgot Password
1. User submits email
2. OTP is generated and emailed
3. User submits OTP + new password
4. Password is updated after OTP validation

## API Reference

### `POST /auth/signup`
Request:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### `POST /auth/verify-email`
Request:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### `POST /auth/login`
Request:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### `POST /auth/forgot-password`
Request:

```json
{
  "email": "user@example.com"
}
```

### `POST /auth/reset-password`
Request:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

## Notes For Production

- Replace in-memory maps with a real database
- Store hashed OTPs, not raw OTP values
- Add rate limiting to OTP endpoints
- Add account lockout and brute-force protection
- Use HTTPS in production
- Rotate JWT secrets periodically
- Add proper logging/monitoring

## Limitations

- uses in-memory storage
- OTP is not hashed
- no distributed session handling

### Email Delivery Limitation

This project uses SMTP (Mailtrap) or Resend in test mode.

In development:
- Emails are NOT delivered to real user inboxes
- Mailtrap captures emails in a sandbox inbox
- Resend test mode only allows sending to the registered account email

Because of this:
- Gmail, Proton Mail, Outlook, etc. will NOT receive OTP emails
- Real user onboarding cannot work without proper email setup

To enable real email delivery:
1. Purchase or use a real domain (for example: yourapp.com)
2. Verify domain in your email provider (Resend / SendGrid / SES)
3. Configure DNS records (SPF, DKIM)
4. Use a valid sender email (for example: no-reply@yourapp.com)

Without domain verification:
- Email delivery will fail or be restricted

## Troubleshooting

- `Failed to send OTP email`:
  - Verify Mailtrap credentials in `.env`
  - Confirm Mailtrap host/port from your inbox SMTP settings

- `JWT secrets are not configured`:
  - Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set

- Port already in use:
  - Change `PORT` in `.env` or stop existing process

## License

This project is licensed under the terms in `LICENSE`.
