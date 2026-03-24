# BusyBrains E-Commerce Application

A full-stack e-commerce web application built with **React** (frontend) and **Spring Boot** (backend), featuring JWT authentication, Google SSO via OAuth 2.0, Role-Based Access Control (RBAC), and user profile management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [SSO Configuration](#sso-configuration-google-oauth-20)
- [Predefined Users](#predefined-users)
- [Security Best Practices](#security-best-practices)

---

## Features

- **JWT Authentication** — Secure stateless login with JSON Web Tokens
- **Google SSO** — OAuth 2.0 / OpenID Connect login via Google
- **RBAC** — Admin and User roles with different permissions
- **Product Management** — Full CRUD for Admin, view-only for Users
- **User Profile** — View/edit personal info, change password
- **Search & Filter** — Real-time product search and category filtering
- **Responsive UI** — Dark luxury theme, mobile-friendly

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, React Router v6, Axios, React Toastify |
| Backend   | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth      | JWT (jjwt 0.12), OAuth2 Client (Google SSO) |
| Database  | H2 (dev) / MySQL (production) |
| Security  | BCrypt, CORS, @PreAuthorize RBAC |

---

## Project Structure

```
ecommerce-app/
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/busybrains/ecommerce/
│       │   ├── EcommerceApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java       # Security, CORS, OAuth2, RBAC
│       │   │   └── DataInitializer.java      # Seeds users & products
│       │   ├── controller/
│       │   │   ├── AuthController.java       # /api/auth/login, /register
│       │   │   ├── ProductController.java    # /api/products CRUD
│       │   │   └── ProfileController.java    # /api/profile
│       │   ├── dto/
│       │   │   └── AuthDtos.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   ├── Product.java
│       │   │   └── Role.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   └── ProductRepository.java
│       │   └── security/
│       │       ├── JwtUtils.java             # Token generation & validation
│       │       ├── JwtAuthFilter.java        # Per-request JWT filter
│       │       ├── CustomUserDetailsService.java
│       │       └── OAuth2SuccessHandler.java # Google SSO callback
│       └── resources/
│           └── application.properties
│
└── frontend/                         # React application
    ├── package.json
    └── src/
        ├── App.js                    # Routes
        ├── index.js
        ├── context/
        │   └── AuthContext.js        # Global auth state
        ├── services/
        │   ├── api.js                # Axios + interceptors
        │   ├── productService.js
        │   └── profileService.js
        ├── components/
        │   ├── Navbar.js/css
        │   ├── ProtectedRoute.js
        │   ├── ProductCard.js/css
        │   └── ProductModal.js/css
        ├── pages/
        │   ├── LoginPage.js          # JWT + Google SSO login
        │   ├── RegisterPage.js
        │   ├── OAuth2CallbackPage.js # SSO redirect handler
        │   ├── DashboardPage.js      # Product grid
        │   ├── AdminPage.js          # Admin table view
        │   └── ProfilePage.js        # Profile management
        └── styles/
            └── global.css
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.8+
- (Optional) MySQL 8+ for production

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/busybrains-ecommerce.git
cd busybrains-ecommerce
```

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:ecommercedb`
  - Username: `sa`, Password: *(empty)*

On startup, `DataInitializer` automatically creates:
- Predefined users (admin + user)
- 8 sample products

### 3. Run the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend starts on **http://localhost:3000**

---

## API Documentation

### Authentication Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/login` | Public | Login with username/password |
| POST | `/api/auth/register` | Public | Register new user account |
| GET | `/oauth2/authorization/google` | Public | Initiate Google SSO |

**Login Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGci...",
  "tokenType": "Bearer",
  "username": "admin",
  "email": "admin@busybrains.com",
  "role": "ROLE_ADMIN",
  "firstName": "Admin",
  "lastName": "User"
}
```

### Product Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/products` | All users | List all products |
| GET | `/api/products/{id}` | All users | Get product by ID |
| GET | `/api/products/search?name=X` | All users | Search by name |
| POST | `/api/products` | Admin only | Create product |
| PUT | `/api/products/{id}` | Admin only | Update product |
| DELETE | `/api/products/{id}` | Admin only | Delete product |

**Create/Update Product Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29999.00,
  "category": "Electronics",
  "imageUrl": "https://...",
  "stock": 50,
  "rating": 4.5,
  "reviewCount": 1234
}
```

### Profile Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/profile` | Authenticated | Get own profile |
| PUT | `/api/profile` | Authenticated | Update profile info |
| PUT | `/api/profile/password` | Authenticated | Change password |

**Change Password Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Authentication

### JWT Flow

```
1. User POST /api/auth/login  { username, password }
2. Backend validates credentials via BCrypt
3. Backend generates signed JWT (HS256, 24h expiry)
4. Frontend stores JWT in localStorage
5. All subsequent requests: Authorization: Bearer <token>
6. JwtAuthFilter validates token on every request
7. SecurityContext is populated with user + authorities
```

### OAuth2 / Google SSO Flow

```
1. User clicks "Continue with Google"
2. Frontend redirects → GET /oauth2/authorization/google
3. Spring redirects → Google's OAuth2 consent screen
4. User grants permission
5. Google redirects → /login/oauth2/code/google
6. OAuth2SuccessHandler: find-or-create user in DB
7. Backend generates JWT, redirects → http://localhost:3000/oauth2/callback?token=<jwt>
8. OAuth2CallbackPage stores token, redirects to dashboard
```

---

## Role-Based Access Control

| Feature | ROLE_USER | ROLE_ADMIN |
|---------|-----------|------------|
| View products | ✅ | ✅ |
| Search & filter | ✅ | ✅ |
| Add to cart | ✅ | ✅ |
| Create product | ❌ | ✅ |
| Edit product | ❌ | ✅ |
| Delete product | ❌ | ✅ |
| Admin Panel | ❌ | ✅ |
| View own profile | ✅ | ✅ |
| Update own profile | ✅ | ✅ |

**Backend enforcement** — `ProductController.java`:
```java
@PostMapping
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Product> createProduct(...) { ... }

@DeleteMapping("/{id}")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<?> deleteProduct(...) { ... }
```

**Frontend enforcement** — `ProtectedRoute.js`:
```jsx
<Route path="/admin" element={
  <ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>
} />
```

---

## SSO Configuration (Google OAuth 2.0)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Credentials**
3. Create **OAuth 2.0 Client ID** (Web application type)
4. Add Authorized redirect URI:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
5. Copy Client ID and Client Secret
6. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   ```

---

## Predefined Users

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `password` | ROLE_ADMIN | Full CRUD on products + Admin Panel |
| `user` | `password` | ROLE_USER | View products only |

Passwords are stored as BCrypt hashes — never plain text.

---

## Production: Switch to MySQL

In `application.properties`, comment out H2 config and uncomment MySQL:

```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/ecommercedb?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

Create the database first:
```sql
CREATE DATABASE ecommercedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Security Best Practices Implemented

- **BCrypt** password hashing (never plain text)
- **JWT** with configurable expiry (default 24h)
- **Stateless** sessions (no server-side session storage)
- **CORS** restricted to `http://localhost:3000`
- **@PreAuthorize** for method-level RBAC enforcement
- **Input validation** with Jakarta Validation annotations
- **401 auto-redirect** via Axios interceptor on token expiry
- **OAuth2 users** stored without passwords (provider-based auth)

---

## GitHub Submission

```bash
git init
git add .
git commit -m "Initial commit: BusyBrains E-Commerce App"
git remote add origin https://github.com/YOUR_USERNAME/busybrains-ecommerce.git
git push -u origin main
```

---

## Testing with Postman

1. **Login:** POST `http://localhost:8080/api/auth/login`
   - Body: `{"username":"admin","password":"password"}`
   - Copy the `token` from response

2. **Set Header:** `Authorization: Bearer <token>`

3. **Get Products:** GET `http://localhost:8080/api/products`

4. **Create Product (Admin):** POST `http://localhost:8080/api/products`

5. **Try as User:** Login with `user/password` → attempt DELETE → expect `403 Forbidden`
