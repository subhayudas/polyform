# Email Setup for Vendor Applications

The vendor application form is now connected to nodemailer to send email notifications when vendors submit their applications.

## Configuration

The email settings are configured in the `.env` file in the root directory:

```
EMAIL_USER=subhayudas49@gmail.com
EMAIL_PASSWORD=ryxm pxpj psrs azhe
RECIPIENT_EMAIL=upthrivex@gmail.com
PORT=3001
```

## Running the Server

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start the email server**:
```bash
npm run server
```

Or for development with auto-reload:
```bash
npm run dev:server
```

The server will run on port 3001 by default.

## Running Both Frontend and Backend

You need to run both the frontend (Vite) and backend (Express) servers:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

## How It Works

1. When a vendor submits an application form:
   - The application is saved to the Supabase database
   - Files are uploaded to Supabase storage
   - An email notification is sent to `RECIPIENT_EMAIL` (upthrivex@gmail.com)

2. The email includes:
   - Company name
   - Contact person details
   - Business information
   - Experience and location
   - Production capacity
   - Description
   - List of attached files

## Email Format

The email is sent as an HTML email with a professional format, including all the vendor application details in a structured layout.

## Troubleshooting

### Email not sending?

1. **Check Gmail App Password**: Make sure you're using an App Password, not your regular Gmail password. To generate one:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

2. **Check server logs**: The server will log any errors when starting up or sending emails.

3. **Check CORS**: Make sure the frontend can reach the backend. The default API URL is `http://localhost:3001`. You can override this by setting `VITE_API_URL` in your frontend `.env` file.

4. **Check environment variables**: Ensure the `.env` file exists and has the correct values.

### Testing the Email Endpoint

You can test the email endpoint directly:

```bash
curl -X POST http://localhost:3001/api/vendor-application \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "contactPerson": "Test Person",
    "email": "test@example.com",
    "phone": "1234567890",
    "businessType": "Manufacturing",
    "experienceYears": 5,
    "location": "Test City",
    "website": "https://example.com",
    "description": "Test description",
    "productionCapacity": "100 units/month",
    "files": []
  }'
```

## Production Deployment

For production, make sure to:
1. Set environment variables on your hosting platform
2. Update `VITE_API_URL` in your frontend build to point to your production API URL
3. Ensure the backend server is accessible from your frontend domain

