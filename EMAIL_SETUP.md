# Email & WhatsApp Notification Setup

## Automatic Email Sending

The admission form is configured to automatically send emails. You have three options:

### Option 1: Web3Forms (Recommended - Free & Easy)
1. Go to https://web3forms.com
2. Sign up for a free account
3. Get your Access Key
4. Replace `YOUR_WEB3FORMS_KEY` in `script.js` line 58 with your access key
5. That's it! Emails will be sent automatically to ABC@gmail.com

### Option 2: Formspree (Free - 50 submissions/month)
1. Go to https://formspree.io
2. Sign up for a free account
3. Create a new form
4. Get your Form ID (looks like: xyz123abc)
5. Replace `YOUR_FORM_ID` in `script.js` line 75 with your form ID
6. Emails will be sent automatically

### Option 3: EmailJS (Free - 200 emails/month)
1. Go to https://www.emailjs.com
2. Sign up for a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Public Key, Service ID, and Template ID
6. Replace in `script.js`:
   - Line 36: `YOUR_PUBLIC_KEY`
   - Line 44: `YOUR_SERVICE_ID`
   - Line 45: `YOUR_TEMPLATE_ID`

## WhatsApp Notification

WhatsApp notifications open automatically with a pre-filled message. The user just needs to click "Send" in the WhatsApp window.

**Note:** For fully automatic WhatsApp sending (without user clicking send), you would need:
- WhatsApp Business API (paid service)
- Backend server setup
- Twilio or similar service

## Current Configuration

- **Email Recipient:** ABC@gmail.com
- **WhatsApp Number:** +923083145670
- **Email Subject:** "New Admission Application - Star Academy Public School Bhiria City"

## Testing

After setup, test the form by:
1. Filling out the admission form
2. Clicking "Submit Application"
3. Checking if email arrives at ABC@gmail.com
4. Verifying WhatsApp message opens with pre-filled text

