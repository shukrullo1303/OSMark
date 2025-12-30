# Authentication System - Visual Guide

## 🔴 Problem Identified

```
┌────────────────────────────────────────────────────────┐
│                    BEFORE (BROKEN)                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  LoginPage                                             │
│  └─ state: username ❌                                 │
│     └─ passes to: login(username, password)            │
│                                                         │
│  AuthContext                                           │
│  └─ login(username, password)                          │
│     └─ calls: svcLogin(username, password)             │
│                                                         │
│  auth.js                                               │
│  └─ login(email, password) ❌ WRONG PARAMETER!         │
│     └─ sends: { email: undefined, password: "..." }    │
│                └─ to: /auth/login/ ❌ WRONG ENDPOINT!  │
│                                                         │
│  API Call                                              │
│  └─ POST /api/auth/login/ with wrong field name        │
│     └─ Result: ❌ 400 Bad Request or Login Failed      │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 🟢 Solution Applied

```
┌────────────────────────────────────────────────────────┐
│                    AFTER (FIXED)                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  LoginPage                                             │
│  └─ state: username ✅                                 │
│     └─ passes to: login(username, password)            │
│                                                         │
│  AuthContext                                           │
│  └─ login(username, password)                          │
│     └─ calls: svcLogin(username, password)             │
│                                                         │
│  auth.js                                               │
│  └─ login(username, password) ✅ CORRECT!              │
│     └─ sends: { username: "johndoe", password: "..." } │
│                └─ to: /auth/token/ ✅ CORRECT!         │
│                                                         │
│  API Call                                              │
│  └─ POST /api/auth/token/ with username field          │
│     └─ Result: ✅ 200 OK with access & refresh tokens  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER REGISTRATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

    User                          Frontend                       Backend
     │                               │                              │
     │  Fill Registration Form        │                              │
     ├──────────────────────────────>│                              │
     │  (first_name, last_name,      │                              │
     │   username, email, password)  │                              │
     │                               │                              │
     │                               │  POST /auth/register/        │
     │                               ├─────────────────────────────>│
     │                               │  {                           │
     │                               │    username,                 │
     │                               │    email,                    │
     │                               │    password,                 │
     │                               │    first_name,               │
     │                               │    last_name                 │
     │                               │  }                           │
     │                               │                              │
     │                               │  Validate:                   │
     │                               │  • Check unique username     │
     │                               │  • Check unique email        │
     │                               │  • Hash password             │
     │                               │  • Create User               │
     │                               │                              │
     │                               │  201 Created                 │
     │                               │<─────────────────────────────┤
     │                               │  {                           │
     │                               │    id, username, email       │
     │                               │  }                           │
     │                               │                              │
     │<──────── Redirect to Login ────┤                              │
     │                               │                              │
     └───────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         USER LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

    User                          Frontend                       Backend
     │                               │                              │
     │  Enter Credentials             │                              │
     │  (username, password)          │                              │
     ├──────────────────────────────>│                              │
     │                               │                              │
     │                               │  POST /auth/token/           │
     │                               ├─────────────────────────────>│
     │                               │  {                           │
     │                               │    username,                 │
     │                               │    password                  │
     │                               │  }                           │
     │                               │                              │
     │                               │  SimpleJWT validates:        │
     │                               │  • Check user exists         │
     │                               │  • Verify password           │
     │                               │  • Generate tokens           │
     │                               │                              │
     │                               │  200 OK                      │
     │                               │<─────────────────────────────┤
     │                               │  {                           │
     │                               │    access,                   │
     │                               │    refresh                   │
     │                               │  }                           │
     │                               │                              │
     │                    Store Tokens in LocalStorage               │
     │                    access_token ✅                             │
     │                    refresh_token ✅                            │
     │                               │                              │
     │                               │  GET /auth/me/               │
     │                               ├─────────────────────────────>│
     │                               │  Headers: Bearer <token>     │
     │                               │                              │
     │                               │  Verify token & return user  │
     │                               │  200 OK                      │
     │                               │<─────────────────────────────┤
     │                               │  {                           │
     │                               │    id,                       │
     │                               │    username,                 │
     │                               │    email,                    │
     │                               │    first_name,               │
     │                               │    last_name,                │
     │                               │    is_staff                  │
     │                               │  }                           │
     │                               │                              │
     │<──── Save User & Redirect ─────┤                              │
     │  to /profile                   │                              │
     │                               │                              │
     │  ✅ LOGGED IN                  │                              │
     └───────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH ON EXPIRY                               │
└─────────────────────────────────────────────────────────────────────────┘

    User                          Frontend                       Backend
     │                               │                              │
     │  Make API Request              │                              │
     │  (e.g., GET /courses/)         │                              │
     ├──────────────────────────────>│                              │
     │                               │                              │
     │                               │  GET /courses/               │
     │                               ├─────────────────────────────>│
     │                               │  Headers: Bearer <token>     │
     │                               │                              │
     │                               │  ❌ Token Expired!            │
     │                               │  401 Unauthorized            │
     │                               │<─────────────────────────────┤
     │                               │                              │
     │           axios interceptor catches 401                       │
     │                               │                              │
     │                               │  POST /auth/token/refresh/   │
     │                               ├─────────────────────────────>│
     │                               │  {                           │
     │                               │    refresh: <old_token>      │
     │                               │  }                           │
     │                               │                              │
     │                               │  Validate & issue new token  │
     │                               │  200 OK                      │
     │                               │<─────────────────────────────┤
     │                               │  {                           │
     │                               │    access: <new_token>       │
     │                               │  }                           │
     │                               │                              │
     │                    Update LocalStorage                        │
     │                    access_token = new_token                  │
     │                               │                              │
     │                               │  GET /courses/ (RETRY)       │
     │                               ├─────────────────────────────>│
     │                               │  Headers: Bearer <new_token> │
     │                               │                              │
     │                               │  200 OK                      │
     │                               │  [Courses Data]              │
     │                               │<─────────────────────────────┤
     │<───────── Return Data ─────────┤                              │
     │  ✅ Auto-refreshed!             │                              │
     │  User doesn't notice            │                              │
     │                               │                              │
     └───────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        COMPONENT STRUCTURE                        │
└──────────────────────────────────────────────────────────────────┘

App
├─ AuthProvider (Global State)
│  ├─ user state
│  ├─ login() method
│  ├─ register() method
│  ├─ logout() method
│  └─ loadProfile() method
│
├─ BrowserRouter
│  ├─ LoginPage
│  │  ├─ useAuth() → login()
│  │  ├─ username input
│  │  └─ password input
│  │
│  ├─ RegisterPage
│  │  ├─ useAuth() → register()
│  │  ├─ first_name input
│  │  ├─ last_name input
│  │  ├─ username input
│  │  ├─ email input
│  │  └─ password input
│  │
│  ├─ ProfilePage
│  │  └─ useAuth() → user data
│  │
│  └─ OtherPages
│     └─ All make API calls with auto-auth header
│
└─ Services
   ├─ auth.js
   │  ├─ login(username, password) → POST /auth/token/
   │  ├─ register(data) → POST /auth/register/
   │  ├─ getProfile() → GET /auth/me/
   │  ├─ setTokens() → Save to localStorage
   │  └─ logout() → Clear localStorage
   │
   ├─ api.js (Axios Client)
   │  ├─ Request Interceptor
   │  │  └─ Add Authorization header with access_token
   │  │
   │  └─ Response Interceptor
   │     ├─ If 401 Unauthorized
   │     │  ├─ POST /auth/token/refresh/
   │     │  ├─ Get new access_token
   │     │  ├─ Retry original request
   │     │  └─ Handle errors
   │     └─ Otherwise
   │        └─ Return response
   │
   └─ Other Services (courses, lessons, quiz, etc.)
      └─ All use api.js (auto-auth included)
```

---

## 🔐 Token Storage & Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       TOKEN MANAGEMENT                            │
└──────────────────────────────────────────────────────────────────┘

LocalStorage After Login:
┌─────────────────────────────────────────────────────┐
│                                                       │
│  access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOi..."    │
│                                                       │
│  refresh_token = "eyJ0eXAiOiJKV1QiLCJhbGciOi..."   │
│                                                       │
└─────────────────────────────────────────────────────┘

Every API Request:
┌────────────────────────────┐
│   axios.interceptors       │
│   ├─ Get access_token      │
│   ├─ Add to header:        │
│   │  Authorization:        │
│   │  Bearer <token>        │
│   └─ Send request          │
└────────────────────────────┘

Token Expiry Handling:
┌──────────────────────────────────────────────────────┐
│                                                       │
│  Response 401 Unauthorized                           │
│  ├─ axios catches error                              │
│  ├─ Get refresh_token                                │
│  ├─ POST /auth/token/refresh/                        │
│  ├─ Get new access_token                             │
│  ├─ Update localStorage                              │
│  ├─ Retry original request                           │
│  └─ Return result to caller                          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 🔀 Endpoint Routing

```
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND URL ROUTING                            │
└──────────────────────────────────────────────────────────────────┘

Django URL Configuration:

config/urls.py
└─ /api/
   └─ src.api.main_routers
      ├─ /courses/     → src.api.urls.course
      ├─ /lessons/     → src.api.urls.lesson
      ├─ /quiz/        → src.api.urls.quiz
      └─ /auth/        → src.api.urls.auth  ✅
                         ├─ /token/         → TokenObtainPairView (SimpleJWT)
                         ├─ /token/refresh/ → TokenRefreshView (SimpleJWT)
                         ├─ /register/      → register_user() [NEW]
                         └─ /me/            → get_current_user() [NEW]

Full Paths:
POST   /api/auth/token/           - Get tokens (login)
POST   /api/auth/token/refresh/   - Refresh expired token
POST   /api/auth/register/        - Register new user
GET    /api/auth/me/              - Get current user profile
```

---

## 📱 Frontend File Organization

```
frontend/
├─ public/
│  └─ index.html
│
├─ src/
│  ├─ App.js
│  ├─ index.js
│  │
│  ├─ context/
│  │  └─ AuthContext.js ✅ CENTRAL HUB
│  │     ├─ user state
│  │     ├─ login() → calls svcLogin()
│  │     ├─ register() → calls svcRegister()
│  │     ├─ logout() → clears tokens
│  │     └─ loadProfile() → calls svcProfile()
│  │
│  ├─ services/
│  │  ├─ auth.js ✅ FIXED
│  │  │  ├─ login(username, password) ✅
│  │  │  │  └─ POST /auth/token/
│  │  │  ├─ register(payload)
│  │  │  │  └─ POST /auth/register/
│  │  │  ├─ getProfile()
│  │  │  │  └─ GET /auth/me/
│  │  │  ├─ setTokens()
│  │  │  └─ logout()
│  │  │
│  │  ├─ api.js
│  │  │  ├─ axios instance
│  │  │  ├─ request interceptor
│  │  │  │  └─ Add Bearer token to header
│  │  │  └─ response interceptor
│  │  │     └─ Handle 401 & auto-refresh
│  │  │
│  │  ├─ courses.js
│  │  ├─ lessons.js
│  │  └─ quiz.js
│  │
│  ├─ pages/
│  │  ├─ LoginPage.js ✅ FIXED
│  │  │  ├─ username input
│  │  │  ├─ password input
│  │  │  └─ calls login()
│  │  │
│  │  ├─ RegisterPage.js ✅ FIXED
│  │  │  ├─ first_name input
│  │  │  ├─ last_name input
│  │  │  ├─ username input
│  │  │  ├─ email input
│  │  │  ├─ password input
│  │  │  └─ calls register()
│  │  │
│  │  ├─ ProfilePage.js
│  │  ├─ HomePage.js
│  │  ├─ CoursePage.js
│  │  ├─ LessonPage.js
│  │  └─ QuizPage.js
│  │
│  ├─ components/
│  │  ├─ Navbar.js
│  │  ├─ CourseCard.js
│  │  ├─ LessonCard.js
│  │  ├─ Quiz.js
│  │  └─ AnswerOption.js
│  │
│  └─ styles/
│     ├─ tokens.css
│     ├─ theme.css
│     └─ [component].css
│
└─ package.json
```

---

## 🧪 Test Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING SEQUENCE                              │
└─────────────────────────────────────────────────────────────────┘

1️⃣ START SERVERS
   Backend: python manage.py runserver
   Frontend: npm start
   ✅ Both running


2️⃣ REGISTER USER
   Browser → http://localhost:3000/register
   Fill form (first_name, last_name, username, email, password)
   Submit
   ✅ Redirects to /login


3️⃣ LOGIN
   Browser → http://localhost:3000/login
   Enter username & password
   Submit
   ✅ Redirects to /profile with user data


4️⃣ VERIFY TOKENS
   F12 → Application → Local Storage
   Check:
   ├─ access_token present ✅
   └─ refresh_token present ✅


5️⃣ VERIFY API CALLS
   F12 → Network tab
   Check requests:
   ├─ POST /auth/register/ → 201 ✅
   ├─ POST /auth/token/ → 200 ✅
   └─ GET /auth/me/ → 200 ✅


6️⃣ VERIFY FUNCTIONALITY
   ├─ Profile page shows user data ✅
   ├─ Logout clears tokens ✅
   ├─ Login again works ✅
   ├─ Other API calls work ✅
   └─ No CORS errors in console ✅


7️⃣ TEST TOKEN REFRESH (OPTIONAL)
   Delete access_token in LocalStorage
   Make any API call
   Verify auto-refresh happens ✅
```

---

## ✅ Verification Checklist

```
FRONTEND FIXES
□ auth.js uses login(username, password)
□ auth.js posts to /auth/token/
□ LoginPage has correct labels
□ LoginPage input type is "text"
□ RegisterPage has all required fields
□ RegisterPage sends correct data

BACKEND ADDITIONS
□ /auth/register/ endpoint exists
□ /auth/me/ endpoint exists
□ Both properly secured with permissions
□ No syntax errors in auth.py

FUNCTIONALITY
□ Registration works
□ Login works
□ Tokens stored in localStorage
□ Tokens sent with API requests
□ Profile loads after login
□ Error messages display correctly

READY FOR TESTING ✅
```

---

This visual guide should help understand the complete flow! 🎯
