# Email Templates

This directory contains email templates for SurveyDash. These templates are designed to be used with Supabase Auth.

## Welcome Email Template

The welcome email has been enhanced with the following features:

### HTML Version (`welcome-email.html`)
- Professional HTML email with SurveyDash branding
- Responsive design with gradient header and modern styling
- Warm, welcoming tone with emphasis on community and impact
- Clear explanation of survey benefits and user value
- Prominent call-to-action button for email confirmation
- Security notice for users who didn't expect the email
- Contact information for support
- Mobile-friendly design

### Text Version (`welcome-email.txt`)
- Plain text version for email clients that don't support HTML
- Same comprehensive content as HTML version
- Easy to read format with clear sections
- All key messaging preserved

## Enhanced Features

### 🎯 What Makes These Templates Special:
- **Personal Touch**: Uses user's name for personalization
- **Community Focus**: Emphasizes joining a movement of change-makers
- **Value Proposition**: Clearly explains how user opinions create real impact
- **Security First**: Includes clear instructions for unexpected emails
- **Support Ready**: Provides contact information for user assistance
- **Professional Design**: Modern, clean aesthetic that builds trust

### Template Variables
- `{{confirmation_link}}` - The email confirmation URL (required)
- `{{user_name}}` - User's full name for personalization
- `{{email_address}}` - User's email address for security notice

## How to Update in Supabase

To update the welcome email in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Email Templates
3. Find the "Confirm signup" template
4. Replace the content with either:
   - HTML version for rich formatting
   - Text version for plain text emails

### Email Flow
1. User signs up → Welcome email sent
2. User clicks confirmation link → Redirects to `/auth/callback`
3. Auth callback processes verification → Redirects to `/login?verified=true`
4. Login page shows success message → User can log in

## File Structure
```
src/templates/
├── welcome-email.html    # Enhanced HTML email template
├── welcome-email.txt     # Enhanced plain text email template
└── README.md            # This documentation
```

## Customization Notes
- Templates emphasize Kenyan market with M-Pesa payment integration
- Focus on mobile accessibility for smartphone users
- Clear value proposition about earning money for opinions
- Professional but warm, community-focused tone
- Built-in security measures and user support
