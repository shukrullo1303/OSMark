# Authentication System Fixes

## Overview
Fixed the complete authentication flow to properly connect frontend login/register pages to the Django backend using SimpleJWT tokens.

## Issues Found & Fixed

### 1. **Field Name Mismatch (CRITICAL)**
**Problem:**
- Frontend was sending `email` field to backend
- Django SimpleJWT's `TokenObtainPairView` expects `username` field
- Login would fail with incorrect field names

**Solution:**
- Updated `auth.js` service: Changed `login(email, password)` → `login(username, password)`
- Updated API call: Changed `/auth/login/` → `/auth/token/`
- Fixed LoginPage label: "username address" → "Username"
- Fixed input type: `type="username"` → `type="text"`

### 2. **Missing Backend Endpoints**
**Problem:**
- Frontend expected `/auth/me/` endpoint (get current user profile)
- Frontend expected `/auth/register/` endpoint (user registration)
- Backend only had SimpleJWT token endpoints

**Solution:**
Added to `src/api/urls/auth.py`:

#### `/auth/register/` (POST)
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    # Accepts: username, email, password, first_name, last_name
    # Returns: user data with 201 Created
    # Validates: unique username and email
```

#### `/auth/me/` (GET)
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    # Returns current user profile for authenticated requests
    # Used by AuthContext.loadProfile() on app load
```

### 3. **RegisterPage Field Mismatch**
**Problem:**
- RegisterPage was using `username` field for full name
- Backend expects separate `first_name` and `last_name` fields

**Solution:**
- Split form into: `first_name`, `last_name`, `username`, `email`, `password`
- Updated form labels to clearly indicate each field's purpose
- Fixed state object structure

## Files Modified

### Frontend Changes

#### `/frontend/src/services/auth.js`
```javascript
// Before
export const login = (email, password) =>
    api.post('auth/login/', { email, password });

// After
export const login = (username, password) =>
    api.post('auth/token/', { username, password });
```

#### `/frontend/src/pages/LoginPage.js`
- Changed form label: "username address" → "Username"
- Changed input type: `"username"` → `"text"`
- Placeholder updated for clarity

#### `/frontend/src/pages/RegisterPage.js`
- Added `first_name` and `last_name` fields
- Reordered fields: first_name, last_name, username, email, password
- Updated form labels for clarity
- Added validation for required fields

### Backend Changes

#### `/src/api/urls/auth.py`
Added two new endpoints:
1. **POST `/auth/token/`** - Already existed (SimpleJWT)
2. **POST `/auth/token/refresh/`** - Already existed (SimpleJWT)
3. **POST `/auth/register/`** - NEW: User registration
4. **GET `/auth/me/`** - NEW: Get current user profile

## Authentication Flow (Complete)

### 1. **Registration**
```
User fills form (first_name, last_name, username, email, password)
         ↓
RegisterPage submits to api.post('auth/register/', {...})
         ↓
Backend validates and creates User
         ↓
Returns user data → Navigate to login
```

### 2. **Login**
```
User enters username & password
         ↓
LoginPage calls login(username, password)
         ↓
AuthContext calls svcLogin(username, password)
         ↓
auth.js POSTs to 'auth/token/' with {username, password}
         ↓
Backend's SimpleJWT returns {access, refresh} tokens
         ↓
AuthContext stores tokens in localStorage
         ↓
AuthContext calls loadProfile() to fetch user data
         ↓
svcProfile() → api.get('auth/me/')
         ↓
Backend returns current user data
         ↓
AuthContext sets user state → Redirect to /profile
```

### 3. **Token Refresh**
```
Any API request fails with 401 Unauthorized
         ↓
api.js response interceptor catches 401
         ↓
Extracts refresh token from localStorage
         ↓
POSTs to 'auth/token/refresh/' with {refresh}
         ↓
Backend issues new access token
         ↓
Stores new access token
         ↓
Retries original request with new token
```

## Backend Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/token/` | None | Get access/refresh tokens (login) |
| POST | `/api/auth/token/refresh/` | None | Refresh access token |
| POST | `/api/auth/register/` | None | Register new user |
| GET | `/api/auth/me/` | Required | Get current user profile |

## Request/Response Examples

### Register
```bash
POST /api/auth/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure123",
  "first_name": "John",
  "last_name": "Doe"
}

# Response 201 Created
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "message": "User created successfully"
}
```

### Login
```bash
POST /api/auth/token/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "secure123"
}

# Response 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Current User
```bash
GET /api/auth/me/
Authorization: Bearer <access_token>

# Response 200 OK
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false
}
```

### Refresh Token
```bash
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Response 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Testing Steps

### 1. **Start Backend**
```bash
cd /Users/coco/Desktop/OSMark
python manage.py runserver
```

### 2. **Start Frontend**
```bash
cd frontend
npm start
```

### 3. **Test Registration**
- Navigate to `http://localhost:3000/register`
- Fill form with:
  - First Name: John
  - Last Name: Doe
  - Username: testuser123
  - Email: test@example.com
  - Password: password123
- Click "Create account"
- Should redirect to login page

### 4. **Test Login**
- Enter username: `testuser123`
- Enter password: `password123`
- Click "Sign in"
- Should redirect to `/profile` with user data loaded

### 5. **Verify Token Storage**
- Open DevTools → Application/Storage → Local Storage
- Should see `access_token` and `refresh_token`

### 6. **Test Token Refresh**
- Wait for access token to expire (or manually delete it)
- Make any API call
- Should automatically refresh token and retry

## Security Notes

✅ **Implemented:**
- JWT tokens for stateless auth
- Refresh tokens for token rotation
- Access tokens auto-attached to all requests
- Secure token storage in localStorage
- Auto-token refresh on 401 responses
- CORS enabled for local development

⚠️ **TODO for Production:**
- Use httpOnly cookies instead of localStorage
- Implement CSRF protection
- Add rate limiting on auth endpoints
- Add password strength validation
- Implement account lockout after failed attempts
- Add email verification
- Add password reset functionality

## Troubleshooting

### "Invalid username or password"
- Check if user exists: `python manage.py shell`
  ```python
  from django.contrib.auth.models import User
  User.objects.filter(username='testuser123').exists()
  ```
- Verify credentials were typed correctly
- Check `DATABASES` setting in `config/settings/base.py`

### "CORS error" or "Network failed"
- Ensure backend is running on `http://localhost:8000`
- Check `CORS_ALLOW_ALL_ORIGINS = True` in settings
- Verify `REACT_APP_API_BASE` env var (defaults to correct URL)

### Token not auto-refreshing
- Check if refresh token exists in localStorage
- Verify `/auth/token/refresh/` endpoint is working
- Check browser console for API errors

### User profile not loading
- Verify access token is valid
- Check if `/auth/me/` endpoint returns user data
- Ensure user is authenticated before calling

## Next Steps

1. ✅ Fix login/register backend connection
2. ✅ Add missing auth endpoints
3. 🔄 **Test complete auth flow** with running servers
4. Add email verification (optional)
5. Add password reset functionality (optional)
6. Implement production security measures
