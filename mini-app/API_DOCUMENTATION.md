# Medical Records API - Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints Overview

### Patients API - `/api/patients`

#### GET `/api/patients`
Get all patients
```json
Response: {
  "success": true,
  "data": [...]
}
```

#### GET `/api/patients/:id`
Get patient by ID

#### POST `/api/patients`
Create new patient
```json
Request Body: {
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St"
}
```
#### PUT `/api/patients/:id`
Update patient (all fields optional)
```json
Request Body: {
  "email": "newemail@example.com",
  "phone": "0987654321"
}
```

#### DELETE `/api/patients/:id`
Delete patient

---

### Notes API - `/api/notes`

#### GET `/api/notes`
Get all notes (optional query param: `?patientId=1`)

#### GET `/api/notes/:id`
Get note by ID

#### POST `/api/notes`
Create new note
```json
Request Body: {
  "patientId": 1,
  "title": "Consultation Note",
  "content": "Patient reports...",
  "category": "consultation"
}
```
Categories: `consultation`, `diagnosis`, `treatment`, `general`

#### PUT `/api/notes/:id`
Update note
```json
Request Body: {
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### DELETE `/api/notes/:id`
Delete note

---

### Summaries API - `/api/summaries`

#### GET `/api/summaries`
Get all summaries (optional query param: `?patientId=1`)

#### GET `/api/summaries/:id`
Get summary by ID

#### POST `/api/summaries`
Create new summary
```json
Request Body: {
  "patientId": 1,
  "title": "Medical Summary Q1 2025",
  "content": "Patient has shown improvement...",
  "dateFrom": "2025-01-01",
  "dateTo": "2025-03-31"
}
```

#### PUT `/api/summaries/:id`
Update summary
```json
Request Body: {
  "title": "Updated Summary Title",
  "content": "Updated summary content"
}
```

#### DELETE `/api/summaries/:id`
Delete summary

---

## Validation Rules

### Patient
- `firstName`: Required, minimum 1 character
- `lastName`: Required, minimum 1 character
- `dateOfBirth`: Required, format YYYY-MM-DD
- `gender`: Required, one of: `male`, `female`, `other`
- `email`: Optional, must be valid email
- `phone`: Optional, minimum 10 digits
- `address`: Optional

### Note
- `patientId`: Required, must be valid patient ID
- `title`: Required, minimum 1 character
- `content`: Required, minimum 1 character
- `category`: Optional, one of: `consultation`, `diagnosis`, `treatment`, `general`

### Summary
- `patientId`: Required, must be valid patient ID
- `title`: Required, minimum 1 character
- `content`: Required, minimum 1 character
- `dateFrom`: Optional, format YYYY-MM-DD
- `dateTo`: Optional, format YYYY-MM-DD

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation error",
  "details": [...]
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Error message"
}
```
