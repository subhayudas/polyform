# Email Server Setup

This server handles sending email notifications for vendor applications using nodemailer.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient@example.com
PORT=3001
```

3. For Gmail, you need to:
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in EMAIL_PASSWORD

## Running the Server

```bash
# Run the server
npm run server

# Run with auto-reload (requires Node 18+)
npm run dev:server
```

The server will run on port 3001 by default (or the port specified in .env).

## API Endpoints

### POST /api/vendor-application
Sends an email notification for a new vendor application.

**Request Body:**
```json
{
  "companyName": "Company Name",
  "contactPerson": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "businessType": "Manufacturing",
  "experienceYears": 5,
  "location": "City, Country",
  "website": "https://example.com",
  "description": "Company description",
  "productionCapacity": "1000 units/month",
  "files": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application email sent successfully",
  "messageId": "email-message-id"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

