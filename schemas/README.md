# Borrower Management System Schemas

This directory contains JSON schemas for the Borrower Management System, defining the data structures for borrowers, guarantors, and groups.

## Overview

The system manages three main entities:
1. **Borrowers** - Individuals who take loans
2. **Guarantors** - Individuals who guarantee loans for borrowers
3. **Groups** - Collections of borrowers for group lending

## Schema Files

### 1. Borrower Schema (`borrower-schema.json`)

Defines the structure for borrower registration and management.

**Key Features:**
- Personal information (name, contact details, demographics)
- Employment and income details
- Identification documents (with image uploads)
- Address information
- Profile image
- Registration details

**Required Fields:**
- `fullname`, `email`, `primary_phone`
- `gender`, `date_of_birth`, `nationality`
- `marital_status`, `occupation`
- `employment_status`, `monthly_income`
- `proof_of_identification`, `identification_number`
- `identification_cards` (2 images: front & back)
- `address`, `city`, `state`, `zipcode`
- `profile_image`, `branch`, `date_of_registration`

**Validation Rules:**
- Phone numbers: 7-15 digits
- Email: Valid email format
- Zipcode: 4-10 digits
- Monthly income: Non-negative number
- ID cards: Exactly 2 base64 images

### 2. Guarantor Schema (`guarantor-schema.json`)

Defines the structure for guarantor registration and management.

**Key Features:**
- Personal information
- Relationship to borrower
- Employment and income details
- Identification documents
- Consent and guarantee details

**Required Fields:**
- `fullname`, `date_of_birth`, `gender`
- `phone_number`, `email`
- `city`, `residential_address`
- `relationship_type`, `relationship_duration`
- `employment_status`, `monthly_income`
- `id_type`, `id_number`
- `identification_cards` (2 images: front & back)
- `profile_image`, `consent_date`

**Validation Rules:**
- Phone numbers: 7-15 digits
- Email: Valid email format
- Monthly income: 1-360 range
- ID cards: Exactly 2 base64 images

### 3. Group Schema (`group-schema.json`)

Defines the structure for borrower group management.

**Key Features:**
- Group identification and description
- Membership management
- Meeting schedules
- Financial requirements
- Group leadership structure

**Required Fields:**
- `name` (only required field)

**Optional Features:**
- Group type, member limits
- Leadership roles (leader, secretary, treasurer)
- Meeting frequency and venue
- Savings requirements
- Loan eligibility criteria

## Data Types and Formats

### Common Field Types

| Field Type | Format | Example |
|------------|--------|---------|
| UUID | `uuid` | `"123e4567-e89b-12d3-a456-426614174000"` |
| Date | `YYYY-MM-DD` | `"2024-01-15"` |
| DateTime | ISO 8601 | `"2024-01-15T10:30:00Z"` |
| Email | Email format | `"user@example.com"` |
| Phone | 7-15 digits | `"1234567890"` |
| Base64 Image | Base64 string | `"data:image/jpeg;base64,/9j/4AAQ..."` |

### Enumerated Values

**Gender:** `["Male", "Female", "Other"]`

**Marital Status:** `["Single", "Married", "Divorced", "Widowed"]`

**Employment Status:** `["Employed", "Self-employed", "Unemployed"]`

**ID Types:** `["National ID", "Driver's License", "Passport", "Voter's Card"]`

**Relationship Types:** `["Friend", "Family", "Colleague", "Other"]`

**Group Types:** `["Individual", "Joint", "Corporate", "Association", "Cooperative"]`

**Meeting Frequency:** `["Weekly", "Bi-weekly", "Monthly", "Quarterly", "Annually"]`

## Relationships

### Borrower ↔ Guarantor
- One borrower can have multiple guarantors
- Each guarantor references a borrower via `borrower_id`
- Guarantors can specify guarantee amounts and percentages

### Borrower ↔ Group
- One borrower can belong to multiple groups
- Groups have member limits and requirements
- Groups track total savings and outstanding loans

### Group Leadership
- Groups can have designated leaders, secretaries, and treasurers
- These roles reference borrower IDs within the group

## File Upload Handling

### Image Requirements
- **Profile Images:** Single image, max 2MB, JPG/PNG/WEBP
- **ID Cards:** Exactly 2 images (front & back), max 5MB each
- **Signatures:** Single image (for guarantors)

### Base64 Encoding
All images are converted to base64 strings before API submission:
```javascript
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
```

## Validation Rules

### Client-Side Validation
- Required field validation
- Format validation (email, phone, dates)
- File size and type validation
- Business rule validation (e.g., min < max amounts)

### Server-Side Validation
- All client-side validations plus:
- Database constraints
- Business logic validation
- Security validation
- Duplicate checking

## API Integration

### Request Format
```javascript
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "primary_phone": "1234567890",
  // ... other fields
  "profile_image": "data:image/jpeg;base64,/9j/4AAQ...",
  "identification_cards": [
    "data:image/jpeg;base64,/9j/4AAQ...",
    "data:image/jpeg;base64,/9j/4AAQ..."
  ]
}
```

### Response Format
```javascript
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "fullname": "John Doe",
    // ... other fields
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Borrower created successfully"
}
```

## Usage Examples

### Creating a Borrower
```javascript
const borrowerData = {
  fullname: "John Doe",
  email: "john@example.com",
  primary_phone: "1234567890",
  gender: "Male",
  date_of_birth: "1990-01-15",
  // ... other required fields
};

// Validate against schema
const isValid = validateBorrower(borrowerData);
if (isValid) {
  // Submit to API
  createBorrower(borrowerData);
}
```

### Creating a Guarantor
```javascript
const guarantorData = {
  fullname: "Jane Smith",
  borrower_id: "123e4567-e89b-12d3-a456-426614174000",
  relationship_type: "Family",
  // ... other required fields
};
```

### Creating a Group
```javascript
const groupData = {
  name: "Farmers Cooperative",
  description: "Group for agricultural loans",
  group_type: "Cooperative",
  max_members: 20,
  // ... other optional fields
};
```

## Security Considerations

1. **Data Validation:** All input data must be validated against schemas
2. **File Upload:** Validate file types, sizes, and scan for malware
3. **Access Control:** Implement role-based access to sensitive data
4. **Audit Trail:** Track all changes with user and timestamp
5. **Data Encryption:** Encrypt sensitive personal information
6. **API Security:** Use HTTPS, authentication, and rate limiting

## Future Enhancements

1. **Additional Fields:** Consider adding fields for credit scoring, loan history
2. **Document Management:** Enhanced document upload and management
3. **Geolocation:** Add GPS coordinates for field visits
4. **Biometric Data:** Fingerprint or facial recognition integration
5. **API Versioning:** Version control for schema changes
6. **Bulk Operations:** Support for bulk import/export operations 