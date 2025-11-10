# Prime Influencer API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://api.primeinfluencer.com
```

## Authentication
Most endpoints require authentication. The server issues HTTP-only cookies for access and refresh tokens. Your HTTP client should send requests with credentials (cookies). Avoid storing tokens in localStorage. For non-browser clients, you may provide a Bearer token when available.

## Response Format

### Success Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

### Validation Error
```json
{
  "errors": [
    {
      "msg": "Validation message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER",
    "avatarUrl": null,
    "createdAt": "2025-11-06T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error or user already exists
- `500` - Server error

---

### Login
Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER",
    "avatarUrl": null
  }
}
```

**Note:** Authentication tokens are set as HTTP-only cookies (`access_token`, `refresh_token`). No token field is returned in the response body.

**Errors:**
- `401` - Invalid credentials
- `500` - Server error

---

### Get Current User
Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "VIEWER",
  "avatarUrl": null,
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-06T12:00:00.000Z"
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found

---

### Logout
Logout current user (token should be removed client-side).

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## Influencer Endpoints

### List Influencers
Get all influencers with filtering, search, and pagination.

**Endpoint:** `GET /api/influencers`  
**Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page | 10 |
| category | string | Filter by category | - |
| city | string | Filter by city | - |
| engagementTier | string | Filter by tier (LOW, MEDIUM, HIGH) | - |
| status | string | Filter by account status (ACTIVE, INACTIVE, PENDING) | - |
| collaborationStatus | string | Filter by collaboration status (PROSPECT, CONTACTED, WARM_LEAD, ACTIVE, PAUSED) | - |
| minFollowers | number | Minimum follower count | - |
| maxFollowers | number | Maximum follower count | - |
| minEngagementRate | number | Minimum engagement rate (fraction, e.g., 0.03 for 3%) | - |
| maxEngagementRate | number | Maximum engagement rate (fraction, e.g., 0.10 for 10%) | - |
| search | string | Search in name, email, city | - |
| sortBy | string | Sort field | createdAt |
| order | string | Sort order (asc, desc) | desc |

**Example Request:**
```
GET /api/influencers?category=Fashion&city=New York&page=1&limit=10&search=emma&minFollowers=100000&maxEngagementRate=0.10
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Emma Fashion",
      "email": "emma@fashionista.com",
      "phone": "+1-555-0101",
      "category": "Fashion",
      "city": "New York",
      "country": "USA",
      "followers": 250000,
      "engagementRate": 0.045,
      "engagementTier": "MEDIUM",
      "platform": "Instagram",
      "collaborationStatus": "PROSPECT",
      "notes": "Specializes in sustainable fashion",
      "avatarUrl": null,
      "status": "ACTIVE",
      "createdAt": "2025-11-06T12:00:00.000Z",
      "updatedAt": "2025-11-06T12:00:00.000Z",
      "createdById": "clx0987654321",
      "createdBy": {
        "id": "clx0987654321",
        "name": "Admin User",
        "email": "admin@primeinfluencer.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### Get Single Influencer
Get detailed information about a specific influencer.

**Endpoint:** `GET /api/influencers/:id`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "name": "Emma Fashion",
  "email": "emma@fashionista.com",
  "phone": "+1-555-0101",
  "category": "Fashion",
  "city": "New York",
  "country": "USA",
  "followers": 250000,
  "engagementRate": 0.045,
  "engagementTier": "MEDIUM",
  "platform": "Instagram",
  "collaborationStatus": "PROSPECT",
  "notes": "Specializes in sustainable fashion",
  "avatarUrl": null,
  "status": "ACTIVE",
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-06T12:00:00.000Z",
  "createdById": "clx0987654321",
  "createdBy": {
    "id": "clx0987654321",
    "name": "Admin User",
    "email": "admin@primeinfluencer.com"
  }
}
```

**Errors:**
- `404` - Influencer not found

---

### Create Influencer
Create a new influencer profile.

**Endpoint:** `POST /api/influencers`  
**Auth Required:** Yes  
**Roles:** ADMIN, EDITOR

**Request Body:**
```json
{
  "name": "New Influencer",
  "email": "influencer@example.com",
  "phone": "+1-555-0199",
  "category": "Fashion",
  "city": "Los Angeles",
  "country": "USA",
  "followers": 50000,
  "engagementRate": 0.052,
  "engagementTier": "LOW",
  "platform": "Instagram",
  "collaborationStatus": "PROSPECT",
  "notes": "Emerging fashion influencer",
  "status": "ACTIVE"
}
```

**Required Fields:**
- name (string)
- category (string)

**Optional Fields:**
- email, phone, city, country
- followers (number, default: 0)
- engagementRate (float, 0.0-1.0 representing fraction, e.g., 0.054 = 5.4%)
- engagementTier (enum: LOW, MEDIUM, HIGH)
- platform, notes, avatarUrl
- collaborationStatus (enum, default: PROSPECT)
- status (enum, default: ACTIVE)

**Response:** `201 Created`
```json
{
  "id": "clx1234567891",
  "name": "New Influencer",
  ...
}
```

**Errors:**
- `400` - Validation error or duplicate email
- `403` - Insufficient permissions

---

### Update Influencer
Update an existing influencer profile.

**Endpoint:** `PUT /api/influencers/:id`  
**Auth Required:** Yes  
**Roles:** ADMIN, EDITOR

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "followers": 60000,
  "engagementRate": 0.055,
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "name": "Updated Name",
  ...
}
```

**Errors:**
- `404` - Influencer not found
- `400` - Validation error or duplicate email
- `403` - Insufficient permissions

---

### Delete Influencer
Delete an influencer profile.

**Endpoint:** `DELETE /api/influencers/:id`  
**Auth Required:** Yes  
**Roles:** ADMIN only

**Response:** `200 OK`
```json
{
  "message": "Influencer deleted successfully"
}
```

**Errors:**
- `404` - Influencer not found
- `403` - Insufficient permissions

---

### Sync Influencer Metrics
Sync metrics from external platforms (mock implementation with simulated data).

**Endpoint:** `POST /api/influencers/:id/sync-metrics`  
**Auth Required:** Yes  
**Roles:** ADMIN, EDITOR

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "name": "Emma Fashion",
  "email": "emma@fashionista.com",
  "phone": "+1-555-0101",
  "category": "Fashion",
  "city": "New York",
  "country": "USA",
  "followers": 251200,
  "engagementRate": 0.048,
  "engagementTier": "MEDIUM",
  "platform": "Instagram",
  "collaborationStatus": "PROSPECT",
  "notes": "Specializes in sustainable fashion",
  "avatarUrl": null,
  "status": "ACTIVE",
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-07T16:30:00.000Z",
  "createdBy": {
    "id": "clx0987654321",
    "name": "Admin User",
    "email": "admin@primeinfluencer.com"
  },
  "syncInfo": {
    "previousFollowers": 250000,
    "followerChange": 1200,
    "previousEngagementRate": 0.045,
    "engagementRateChange": 0.003,
    "syncedAt": "2025-11-07T16:30:00.000Z"
  }
}
```

**Note:** This is a mock implementation that simulates external API integration. It randomizes follower growth (-200 to +800) and engagement rate fluctuations (±0.5%). In production, this would connect to real platform APIs (Instagram, TikTok, YouTube, etc.).

**Errors:**
- `404` - Influencer not found
- `403` - Insufficient permissions

---

### Get Influencer Statistics
Get analytics and statistics about influencers.

**Endpoint:** `GET /api/influencers/analytics/stats`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "totalInfluencers": 15,
  "activeInfluencers": 14,
  "totalFollowers": 1234567,
  "avgEngagementRate": 5.4,
  "byCategory": [
    { "category": "Fashion", "count": 5 },
    { "category": "Technology", "count": 3 }
  ],
  "byTier": [
    { "engagementRateTier": "LOW", "count": 6 },
    { "engagementRateTier": "HIGH", "count": 4 }
  ],
  "byStatus": [
    { "status": "ACTIVE", "count": 14 },
    { "status": "INACTIVE", "count": 1 }
  ]
}
```

**Note:** `avgEngagementRate` is returned as a percentage (e.g., 5.4 means 5.4%), while individual influencer records return `engagementRate` as a fraction (0.054).

**Performance Note:** The statistics endpoint uses multiple aggregation queries (groupBy). For large datasets (>10,000 influencers), consider caching this endpoint or using materialized views.

---

## User Endpoints

### List Users
Get all users (Admin only).

**Endpoint:** `GET /api/users`  
**Auth Required:** Yes  
**Roles:** ADMIN

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER",
      "avatarUrl": null,
      "createdAt": "2025-11-06T12:00:00.000Z",
      "updatedAt": "2025-11-06T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Get User
Get a specific user by ID.

**Endpoint:** `GET /api/users/:id`  
**Auth Required:** Yes  
**Roles:** ADMIN

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "VIEWER",
  "avatarUrl": null,
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-06T12:00:00.000Z"
}
```

---

### Update User
Update a user profile.

**Endpoint:** `PUT /api/users/:id`  
**Auth Required:** Yes  
**Roles:** ADMIN or own profile

**Request Body:**
```json
{
  "name": "Updated Name",
  "avatarUrl": "https://example.com/avatar.jpg",
  "role": "EDITOR"
}
```

**Notes:**
- Only ADMIN can change role
- Users can update their own profile (except role)
- Password can be updated by including it in body

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "email": "user@example.com",
  "name": "Updated Name",
  ...
}
```

---

### Delete User
Delete a user account.

**Endpoint:** `DELETE /api/users/:id`  
**Auth Required:** Yes  
**Roles:** ADMIN

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

**Errors:**
- `400` - Cannot delete own account
- `404` - User not found

---

## Category Endpoints

### List Categories
Get all categories.

**Endpoint:** `GET /api/categories`  
**Auth Required:** No

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Fashion",
    "description": "Fashion and style influencers",
    "createdAt": "2025-11-06T12:00:00.000Z",
    "updatedAt": "2025-11-06T12:00:00.000Z"
  }
]
```

---

### Create Category
Create a new category.

**Endpoint:** `POST /api/categories`  
**Auth Required:** Yes  
**Roles:** ADMIN

**Request Body:**
```json
{
  "name": "Sports",
  "description": "Sports and athletics influencers"
}
```

**Response:** `201 Created`
```json
{
  "id": "clx1234567891",
  "name": "Sports",
  "description": "Sports and athletics influencers",
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-06T12:00:00.000Z"
}
```

---

## Enums

### Role
```
ADMIN   - Full access
EDITOR  - Can manage influencers
VIEWER  - Read-only access
```

### EngagementRateTier
```
LOW     - Low engagement rate (< 3%)
MEDIUM  - Medium engagement rate (3-6%)
HIGH    - High engagement rate (> 6%)
```

### CollaborationStatus (Data model)
```
PROSPECT    - Lead identified
CONTACTED   - Initial contact made
WARM_LEAD   - Positive interest shown
ACTIVE      - Active collaboration ongoing
PAUSED      - Collaboration temporarily on hold
```

### Status
```
ACTIVE    - Active profile
INACTIVE  - Inactive profile
PENDING   - Pending approval
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Not Authenticated |
| 403 | Forbidden / Insufficient Permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting
The API implements rate limiting to prevent abuse:

### General Rate Limits
- **100 requests per 15 minutes** per IP address across all endpoints

### Authentication Endpoints
- **5 requests per 15 minutes** per IP address
- Applies to: `/api/auth/register`, `/api/auth/login`

### API Endpoints
- **60 requests per minute** per IP address
- Applies to: `/api/influencers/*`, `/api/users/*`

When rate limit is exceeded, the API returns `429 Too Many Requests` with a message indicating when to retry.

---

## Testing

### Example with curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@primeinfluencer.com",
    "password": "password123"
  }'
```

**Get Influencers (using cookies):**
```bash
curl http://localhost:5000/api/influencers \
  -b cookies.txt
```

**Create Influencer:**
```bash
curl -X POST http://localhost:5000/api/influencers \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Influencer",
    "category": "Tech",
    "followers": 50000
  }'
```

### Example with JavaScript (fetch)

```javascript
// Login (cookies are automatically stored by browser)
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({
    email: 'admin@primeinfluencer.com',
    password: 'password123',
  }),
});

const { user } = await response.json();

// Get influencers (cookies sent automatically)
const influencers = await fetch('http://localhost:5000/api/influencers', {
  credentials: 'include', // Important: send cookies
});

const data = await influencers.json();
console.log(data);
```

---

## Changelog

### v1.0.0 (2025-11-06)
- Initial API release
- Authentication and authorization
- Full CRUD for influencers
- User management
- Category management
- Filtering and search
- Analytics endpoint
