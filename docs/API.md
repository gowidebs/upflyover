# Waha Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new company account.

**Request Body:**
```json
{
  "name": "Company Name",
  "email": "company@example.com",
  "password": "SecurePass123!",
  "industry": "Technology",
  "companySize": "medium",
  "country": "United Arab Emirates"
}
```

#### POST /auth/login
Login to existing account.

#### GET /auth/profile
Get current company profile (Protected).

### Companies

#### GET /companies
Get list of companies with filtering and pagination.

#### GET /companies/:id
Get specific company details.

#### PUT /companies/profile
Update company profile (Protected).

### Requirements

#### GET /requirements
Get list of requirements with filtering.

#### POST /requirements
Create new requirement (Protected).

#### GET /requirements/:id
Get specific requirement details.

### EOI & Quotations

#### POST /requirements/:id/eoi
Submit EOI for a requirement (Protected).

#### POST /requirements/:id/quotations
Submit quotation (Protected).

### Matching

#### GET /matching/requirements
Get AI-matched requirements for current company (Protected).

#### GET /matching/companies
Get AI-matched companies for current company (Protected).