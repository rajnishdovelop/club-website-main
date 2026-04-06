# Cloudinary Setup Guide

## Quick Setup for Image Upload

To enable image upload functionality, you need to configure Cloudinary (free tier available):

### Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signup, go to your Dashboard

### Step 2: Get Your Credentials

In your Cloudinary Dashboard, you'll find:

- **Cloud Name**: Usually shown at the top
- **API Key**: In the Account Details section
- **API Secret**: In the Account Details section (click "Show" to reveal)

### Step 3: Update Environment Variables

Open your `.env.local` file and update these values:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### Step 4: Test the Upload

1. Restart your development server: `npm run dev`
2. Go to the admin team management page
3. Try uploading an image - it should now work!

## Features Included

✅ **Drag & Drop Upload**: Users can drag images directly into the upload area
✅ **File Validation**: Only JPEG, PNG, and WebP files allowed (max 5MB)
✅ **Automatic Optimization**: Images are automatically resized to 400x400px and optimized
✅ **Progress Indication**: Visual feedback during upload
✅ **Preview**: Immediate preview of uploaded images
✅ **Error Handling**: User-friendly error messages

## Fallback Mode

If Cloudinary is not configured, the system will:

- Show an error message when trying to upload
- Still allow manual URL entry as backup
- Continue to work with existing image URLs

## Free Tier Limits

Cloudinary free tier includes:

- 25 GB storage
- 25 GB monthly bandwidth
- Image and video transformations
- Basic optimization features

This is more than enough for most team websites!

---

**Note**: Make sure to restart your development server after updating the environment variables.
