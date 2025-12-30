# Quick Start: Testing Authentication

## Changes Made

### ✅ Frontend Fixed
- `auth.js`: Now sends `username` instead of `email` to `/auth/token/` endpoint
- `LoginPage.js`: Fixed form label and input type
- `RegisterPage.js`: Fixed all form fields to match backend expectations

### ✅ Backend Enhanced
- Added `/auth/register/` endpoint for user registration
- Added `/auth/me/` endpoint to get current user profile
- Both endpoints properly secured with permissions

---

## Test in 3 Steps

### Step 1: Start Backend
```bash
cd /Users/coco/Desktop/OSMark
python manage.py runserver
```
Backend runs on `http://localhost:8000/api/`

### Step 2: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

### Step 3: Test Registration
1. Go to `http://localhost:3000/register`
2. Fill the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create account"
4. Should redirect to login page ✓

### Step 4: Test Login
1. Go to `http://localhost:3000/login` (or click "Sign in" link)
2. Enter:
   - Username: `testuser123`
   - Password: `password123`
3. Click "Sign in"
4. Should redirect to `/profile` with user data loaded ✓

---

## Verify Token Flow

Open DevTools (F12) → Application → Local Storage → `http://localhost:3000`

You should see:
- `access_token` - JWT token for authenticated requests
- `refresh_token` - JWT token for refreshing access token

Check Network tab:
- Register: `POST /auth/register/` → 201 Created
- Login: `POST /auth/token/` → 200 OK (returns access & refresh)
- Get Profile: `GET /auth/me/` → 200 OK (returns user data)

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid username or password" | User doesn't exist or wrong password | Verify user was registered successfully |
| CORS error | Backend not running or CORS not enabled | Start backend on port 8000 |
| Network error | Can't reach API | Check `REACT_APP_API_BASE` env variable |
| Token not refreshing | Refresh endpoint issue | Verify `/auth/token/refresh/` works in terminal |
| Profile not loading | User not authenticated | Check if access_token is in localStorage |

---

## Test Backend Directly (Optional)

Test registration with curl:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser456",
    "email": "test456@example.com",
    "password": "password123",
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```

Test login with curl:
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser456",
    "password": "password123"
  }'
```

Response should include `access` and `refresh` tokens:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Files Changed

**Frontend:**
- `frontend/src/services/auth.js` - Fixed login endpoint and field names
- `frontend/src/pages/LoginPage.js` - Fixed form labels
- `frontend/src/pages/RegisterPage.js` - Fixed form fields

**Backend:**
- `src/api/urls/auth.py` - Added register and me endpoints

---

## Architecture Overview

```
User Registration Flow:
┌─────────────────┐
│   RegisterPage  │ - Accepts: username, email, password, first_name, last_name
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   POST /auth/register/              │
│   Backend validates & creates user  │
└──────────┬──────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │  User Login  │
    └──────┬───────┘
           │
           ▼
┌──────────────────────────────────────┐
│   POST /auth/token/                  │
│   {username, password}               │
│   Returns: {access, refresh} tokens  │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│   GET /auth/me/                      │
│   Fetch current user profile         │
│   Headers: Authorization: Bearer ... │
└──────────┬───────────────────────────┘
           │
           ▼
    ┌────────────────┐
    │ Logged In ✓    │
    │ Profile Loaded │
    └────────────────┘
```

---

## What's Working Now

✅ User registration with validation
✅ User login with JWT tokens
✅ Token refresh on expiry
✅ Get current user profile
✅ Automatic token attachment to requests
✅ Error handling with user feedback

---

## Production Checklist

Before deploying to production:
- [ ] Change CORS settings (don't allow all origins)
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Add email verification
- [ ] Add password strength requirements
- [ ] Implement account lockout
- [ ] Add logging and monitoring
- [ ] Use environment variables for secrets
