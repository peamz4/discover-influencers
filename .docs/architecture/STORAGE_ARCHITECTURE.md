# Auth & Storage Architecture

## ✅ Storage Best Practices Implementation

ตามหลัก security และ performance best practices:

### 📦 Storage Strategy

| ข้อมูล              | เก็บที่                    | เหตุผล                                              |
| ------------------- | -------------------------- | --------------------------------------------------- |
| **Token**           | ✅ HttpOnly Cookie         | ป้องกัน XSS, ไม่สามารถเข้าถึงจาก JavaScript        |
| **User Profile**    | ✅ sessionStorage          | หายเมื่อปิด tab, เร็วกว่า API call                 |
| **isAuthenticated** | ✅ derive จาก token        | ไม่ต้องเก็บ, คำนวณจากการ verify token              |
| **Theme/UI prefs**  | ✅ localStorage            | Non-sensitive, ต้องการ persist ข้าม session        |

---

## 🔐 Token Management (HttpOnly Cookies)

### Implementation
**File**: `apps/api/src/routes/auth.ts`

```typescript
// Cookie options for secure HttpOnly cookies
const accessTokenCookieOptions = {
  httpOnly: true,  // ✅ ไม่สามารถเข้าถึงจาก JavaScript
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'lax',  // CSRF protection
  maxAge: 15 * 60 * 1000,  // 15 minutes
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/api/auth',  // Only send on auth routes
};
```

### Benefits
- ✅ **ป้องกัน XSS**: JavaScript ไม่สามารถอ่าน token ได้
- ✅ **ป้องกัน CSRF**: `sameSite: 'lax'` ช่วยป้องกัน
- ✅ **Auto-send**: Browser ส่ง cookies โดยอัตโนมัติ
- ✅ **Secure**: ใช้ HTTPS ใน production

### Token Lifecycle
```
Login → Create tokens → Set HttpOnly cookies
   ↓
API Request → Browser sends cookies automatically
   ↓
Token expired? → Interceptor calls /refresh → New access token
   ↓
Refresh token expired? → Clear cookies → Redirect to login
```

---

## 👤 User Profile (sessionStorage)

### Implementation
**File**: `apps/web/lib/store/auth.ts`

```typescript
// Session storage keys
const USER_KEY = 'prime_user';

const saveUserToSession = (user: User) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const loadUserFromSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};
```

### Why sessionStorage?
- ✅ **Security**: หายเมื่อปิด tab (ลดความเสี่ยง)
- ✅ **Performance**: ไม่ต้อง fetch user profile ทุก request
- ✅ **Isolation**: แต่ละ tab มี session แยกกัน
- ✅ **Auto-cleanup**: Browser ลบข้อมูลเมื่อปิด tab

### Data Flow
```
Login → API returns user → Save to sessionStorage → Update Zustand
   ↓
Page refresh → Load from sessionStorage → Verify with API
   ↓
API returns 401 → Clear sessionStorage → Redirect to login
   ↓
Close tab → sessionStorage auto-cleared by browser
```

---

## 🎨 Theme/UI Preferences (localStorage)

### Implementation
**File**: `apps/web/lib/store/theme.ts`

```typescript
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'dark',
      sidebarCollapsed: false,
      // ... theme preferences
    }),
    {
      name: 'prime-theme-storage',  // localStorage key
    }
  )
);
```

### Why localStorage?
- ✅ **Persist**: ต้องการเก็บข้าม sessions
- ✅ **Non-sensitive**: ไม่มีข้อมูลสำคัญ
- ✅ **User preference**: ผู้ใช้คาดหวังว่าจะจำได้
- ✅ **Performance**: โหลดเร็ว, ไม่ต้อง API call

### What to Store
```typescript
{
  colorScheme: 'dark' | 'light' | 'system',
  sidebarCollapsed: boolean,
  language: 'en' | 'th',
  // ข้อมูล UI อื่นๆ ที่ไม่ sensitive
}
```

---

## 🔄 isAuthenticated (Derived State)

### Implementation
**File**: `apps/web/lib/store/auth.ts`

```typescript
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,  // Derived from user existence
  
  setAuth: (user) => {
    saveUserToSession(user);
    set({ user, isAuthenticated: true });  // Set together
  },
  
  clearAuth: () => {
    clearUserFromSession();
    set({ user: null, isAuthenticated: false });  // Clear together
  },
}));
```

### Why Derived?
- ✅ **Single source of truth**: `isAuthenticated` คำนวณจาก `user`
- ✅ **No sync issues**: ไม่มีปัญหา user มีแต่ isAuthenticated = false
- ✅ **Token-based**: ความจริงอยู่ที่ server (HttpOnly cookies)
- ✅ **Auto-updated**: เปลี่ยน user → isAuthenticated เปลี่ยนตาม

### Verification Flow
```
User in sessionStorage? → YES → Call /api/auth/me
   ↓                              ↓
   NO                          Valid cookies?
   ↓                              ↓
Show login                    YES → Set user & isAuthenticated = true
                                 ↓
                                 NO → Clear all → isAuthenticated = false
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐│
│  │ sessionStorage│    │ localStorage │    │   Memory   ││
│  ├──────────────┤    ├──────────────┤    ├────────────┤│
│  │ User Profile │    │ Theme/UI     │    │ Zustand    ││
│  │ - id         │    │ - colorScheme│    │ Store      ││
│  │ - email      │    │ - sidebar    │    │ State      ││
│  │ - name       │    │ - language   │    └────────────┘│
│  │ - role       │    └──────────────┘                   │
│  └──────────────┘                                        │
│         ↕                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │     Auth Initialization Hook (useAuthInit)       │   │
│  │  1. Load user from sessionStorage                │   │
│  │  2. Verify session with /api/auth/me            │   │
│  │  3. Update/clear based on response               │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP Request + HttpOnly Cookies
                        │ (access_token, refresh_token)
┌───────────────────────▼─────────────────────────────────┐
│                   Backend (Express.js)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │            JWT Middleware                        │   │
│  │  1. Read cookies from request                    │   │
│  │  2. Verify access_token                          │   │
│  │  3. If expired → check refresh_token            │   │
│  │  4. Return user data or 401                      │   │
│  └─────────────────────────────────────────────────┘   │
│         ↕                                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                 │   │
│  │  - users table (with hashed passwords)          │   │
│  │  - refresh_tokens table (with expiry)           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Benefits

### 1. Token Security
```
✅ HttpOnly cookies → JavaScript ไม่สามารถเข้าถึง
✅ Secure flag → ส่งผ่าน HTTPS เท่านั้น
✅ SameSite → ป้องกัน CSRF attacks
✅ Short-lived → Access token หมดอายุเร็ว (15 นาที)
```

### 2. Data Isolation
```
✅ sessionStorage → หายเมื่อปิด tab
✅ localStorage → เฉพาะ UI preferences
✅ Memory → Sensitive calculations
✅ Server validation → ความจริงอยู่ที่ server
```

### 3. XSS Protection
```
✅ No tokens in JavaScript → Hacker ขโมย token ไม่ได้
✅ HttpOnly → document.cookie ไม่เห็น
✅ Validation → ตรวจสอบทุก request
✅ Auto-cleanup → หมดอายุอัตโนมัติ
```

---

## 📝 Code Examples

### 1. Login Flow
```typescript
// User logs in
await authService.login({ email, password })
  ↓
// Server sets HttpOnly cookies
res.cookie('access_token', token, { httpOnly: true })
res.cookie('refresh_token', refreshToken, { httpOnly: true })
  ↓
// Server returns user data
res.json({ user: { id, email, name, role } })
  ↓
// Frontend saves to sessionStorage
setAuth(user)  // → sessionStorage.setItem('prime_user', JSON.stringify(user))
```

### 2. Refresh Flow
```typescript
// Access token expired
API returns 401
  ↓
// Interceptor catches
axios.interceptors.response
  ↓
// Call refresh endpoint (cookies sent automatically)
POST /api/auth/refresh
  ↓
// Server validates refresh_token from cookie
  ↓
// If valid → Set new access_token cookie
// If invalid → Return 401
  ↓
// Retry original request or redirect to login
```

### 3. Logout Flow
```typescript
// User clicks logout
await authService.logout()
  ↓
// Server clears cookies
res.clearCookie('access_token')
res.clearCookie('refresh_token')
  ↓
// Frontend clears sessionStorage
clearAuth()  // → sessionStorage.removeItem('prime_user')
  ↓
// Redirect to login
router.push('/login')
```

---

## 🎯 Implementation Checklist

### Backend (Express.js)
- ✅ Set HttpOnly cookies for tokens
- ✅ Secure flag in production
- ✅ SameSite protection
- ✅ Token validation middleware
- ✅ Refresh token endpoint

### Frontend (Next.js)
- ✅ User profile in sessionStorage
- ✅ Theme preferences in localStorage
- ✅ Zustand store for state management
- ✅ Auth initialization hook
- ✅ Token refresh interceptor

### Security
- ✅ No tokens in localStorage
- ✅ No sensitive data in memory longer than needed
- ✅ Server-side validation
- ✅ HTTPS in production
- ✅ CORS configuration

---

## 📚 Related Files

### Auth Files
- `apps/web/lib/store/auth.ts` - Auth state (sessionStorage)
- `apps/web/lib/store/theme.ts` - Theme state (localStorage)
- `apps/web/lib/hooks/use-auth-init.ts` - Auth initialization
- `apps/web/lib/api.ts` - API client with interceptors
- `apps/api/src/routes/auth.ts` - Auth endpoints
- `apps/api/src/lib/auth.ts` - JWT utilities

### Documentation
- `AUTH_REFRESH_FIX.md` - Token refresh implementation
- `AUTH_PERSISTENCE_FIX.md` - Session persistence
- `STORAGE_ARCHITECTURE.md` - This file

---

**Status**: ✅ Implemented - Following security best practices
**Date**: November 7, 2025
**Architecture**: Token (HttpOnly) + Profile (sessionStorage) + Theme (localStorage)
