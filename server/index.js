import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Vendor application email endpoint
app.post('/api/vendor-application', async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      businessType,
      experienceYears,
      location,
      website,
      description,
      productionCapacity,
      files,
    } = req.body;

    // Validate required fields
    if (!companyName || !contactPerson || !email || !businessType || !location || !description || !productionCapacity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Vendor Application: ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #90a955;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .field {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .field-label {
              font-weight: bold;
              color: #90a955;
              margin-bottom: 5px;
            }
            .field-value {
              color: #333;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Vendor Application</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Company Name:</div>
                <div class="field-value">${companyName}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Contact Person:</div>
                <div class="field-value">${contactPerson}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value">${phone}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="field-label">Business Type:</div>
                <div class="field-value">${businessType}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Years of Experience:</div>
                <div class="field-value">${experienceYears} years</div>
              </div>
              
              <div class="field">
                <div class="field-label">Location:</div>
                <div class="field-value">${location}</div>
              </div>
              
              ${website ? `
              <div class="field">
                <div class="field-label">Website:</div>
                <div class="field-value"><a href="${website}" target="_blank">${website}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="field-label">Production Capacity:</div>
                <div class="field-value">${productionCapacity}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Description:</div>
                <div class="field-value">${description.replace(/\n/g, '<br>')}</div>
              </div>
              
              ${files && files.length > 0 ? `
              <div class="field">
                <div class="field-label">Attached Files:</div>
                <div class="field-value">${files.length} file(s) attached</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated email from the PolyForm Vendor Application System</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Vendor Application

Company Name: ${companyName}
Contact Person: ${contactPerson}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Business Type: ${businessType}
Years of Experience: ${experienceYears} years
Location: ${location}
${website ? `Website: ${website}` : ''}
Production Capacity: ${productionCapacity}

Description:
${description}

${files && files.length > 0 ? `\nAttached Files: ${files.length} file(s)` : ''}
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Application email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Email user: ${process.env.EMAIL_USER}`);
  console.log(`Recipient email: ${process.env.RECIPIENT_EMAIL}`);
});

