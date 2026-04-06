# Backend Implementation Plan for Admin Dashboard

## Project Overview

Create a comprehensive backend system with MongoDB integration for managing team members and other data through an admin dashboard.

## Phase 1: Environment Setup & Dependencies

### 1.1 Install Required Dependencies

- **Database & Authentication:**
  - `mongoose` - MongoDB ODM
  - `bcryptjs` - Password hashing
  - `jsonwebtoken` - JWT authentication
  - `next-auth` - Next.js authentication
- **Validation & Utilities:**
  - `joi` or `zod` - Data validation
  - `multer` - File upload handling
  - `cloudinary` - Image storage (optional)

### 1.2 Environment Configuration

- Create `.env.local` file with MongoDB connection string
- Set up JWT secret and other environment variables
- Configure database connection

## Phase 2: Database Models & Schema

### 2.1 User Model (`models/User.js`)

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'editor']),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### 2.2 TeamMember Model (`models/TeamMember.js`)

```javascript
{
  _id: ObjectId,
  name: String,
  position: String,
  department: String,
  skills: [String],
  image: String (URL/path),
  social: {
    insta: String,
    linkedin: String,
    email: String
  },
  isActive: Boolean,
  order: Number (for sorting),
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (ref: User)
}
```

### 2.3 Additional Models (Future Phases)

- `Achievement.js` - For achievements page
- `Activity.js` - For recent activities page

## Phase 3: Database Connection & Utilities

### 3.1 Database Connection (`lib/mongodb.js`)

- MongoDB connection setup
- Connection pooling
- Error handling

### 3.2 Database Utilities (`lib/dbConnect.js`)

- Reusable connection function
- Environment-based configuration

### 3.3 Seeder Script (`scripts/seedAdmin.js`)

- Create default admin user
- Initial data population

## Phase 4: Authentication System

### 4.1 Authentication Configuration (`lib/auth.js`)

- NextAuth.js configuration
- JWT strategy implementation
- Session management

### 4.2 Middleware (`middleware.js`)

- Route protection
- Role-based access control
- Authentication verification

### 4.3 Authentication Utilities (`lib/authUtils.js`)

- Password hashing functions
- JWT token generation/verification
- User validation helpers

## Phase 5: API Routes Development

### 5.1 Authentication APIs

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### 5.2 Team Members APIs

- `GET /api/team` - Get all team members (public)
- `GET /api/admin/team` - Get all team members (admin)
- `POST /api/admin/team` - Create new team member
- `PUT /api/admin/team/[id]` - Update team member
- `DELETE /api/admin/team/[id]` - Delete team member

### 5.3 User Management APIs (Admin only)

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### 5.4 File Upload APIs

- `POST /api/upload/image` - Upload team member images
- Image processing and optimization

## Phase 6: Frontend Pages Development

### 6.1 Login Page (`/login`)

- Login form with validation
- Error handling
- Redirect after successful login
- Responsive design

### 6.2 Admin Dashboard (`/admin`)

- Protected route (admin only)
- Dashboard overview
- Navigation to different management sections
- User info display

### 6.3 Team Management Page (`/admin/team`)

- List all team members
- Add new team member form
- Edit existing team members
- Delete team members
- Image upload functionality
- Drag & drop ordering

### 6.4 User Management Page (`/admin/users`)

- List all users
- Add new admin users
- Edit user roles
- Deactivate users

## Phase 7: Frontend Components Development

### 7.1 Admin Components

- `AdminLayout.js` - Layout wrapper for admin pages
- `AdminNavbar.js` - Admin navigation
- `TeamMemberForm.js` - Form for add/edit team members
- `TeamMemberCard.js` - Display team member in admin view
- `UserForm.js` - Form for user management

### 7.2 Protection Components

- `ProtectedRoute.js` - Route protection wrapper
- `AdminOnly.js` - Admin role verification

### 7.3 UI Components

- `LoadingSpinner.js` - Loading states
- `ErrorMessage.js` - Error display
- `SuccessMessage.js` - Success notifications
- `ConfirmDialog.js` - Confirmation dialogs

## Phase 8: Data Integration

### 8.1 Update Existing Components

- Modify `TeamMembers.js` to fetch data from API
- Add loading states and error handling
- Implement real-time updates

### 8.2 State Management

- Consider Context API or Zustand for global state
- Manage authentication state
- Handle data caching

## Phase 9: Security & Validation

### 9.1 Input Validation

- Server-side validation for all APIs
- Client-side form validation
- Sanitize user inputs

### 9.2 Security Measures

- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection

### 9.3 File Upload Security

- File type validation
- File size limits
- Secure file storage

## Phase 10: Testing & Optimization

### 10.1 API Testing

- Unit tests for API routes
- Integration tests
- Error scenario testing

### 10.2 Performance Optimization

- Database query optimization
- Image optimization
- Caching strategies

### 10.3 Security Testing

- Authentication flow testing
- Authorization testing
- Input validation testing

## Implementation Order

1. **Week 1:** Environment setup, dependencies, database models
2. **Week 2:** Database connection, authentication system, basic APIs
3. **Week 3:** Admin login page, admin dashboard, team management
4. **Week 4:** Integration with existing components, testing, optimization

## File Structure After Implementation

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── team/
│   │   │   └── page.js
│   │   └── users/
│   │       └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   └── logout/
│   │   │       └── route.js
│   │   ├── admin/
│   │   │   ├── team/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   └── users/
│   │   │       ├── route.js
│   │   │       └── [id]/
│   │   │           └── route.js
│   │   ├── team/
│   │   │   └── route.js
│   │   └── upload/
│   │       └── image/
│   │           └── route.js
│   ├── login/
│   │   └── page.js
│   └── globals.css
├── components/
│   ├── admin/
│   │   ├── AdminLayout.js
│   │   ├── AdminNavbar.js
│   │   ├── TeamMemberForm.js
│   │   ├── TeamMemberCard.js
│   │   └── UserForm.js
│   ├── auth/
│   │   ├── ProtectedRoute.js
│   │   └── LoginForm.js
│   └── ui/
│       ├── LoadingSpinner.js
│       ├── ErrorMessage.js
│       └── ConfirmDialog.js
├── lib/
│   ├── mongodb.js
│   ├── dbConnect.js
│   ├── auth.js
│   └── authUtils.js
├── models/
│   ├── User.js
│   ├── TeamMember.js
│   ├── Achievement.js
│   └── Activity.js
├── scripts/
│   └── seedAdmin.js
└── middleware.js
```

## Environment Variables Required

```
MONGODB_URI=mongodb://localhost:27017/your-db-name
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=defaultpassword
CLOUDINARY_CLOUD_NAME=your-cloud-name (optional)
CLOUDINARY_API_KEY=your-api-key (optional)
CLOUDINARY_API_SECRET=your-api-secret (optional)
```

## Success Metrics

- [x] Admin can login securely
- [x] Admin can view all team members
- [x] Admin can add new team members
- [x] Admin can edit existing team members
- [x] Admin can delete team members
- [x] Team members page displays data from database
- [x] Images are properly uploaded and stored (Cloudinary integration with drag & drop)
- [x] All routes are properly protected
- [x] Data validation works correctly
- [x] Error handling is comprehensive

## Future Enhancements

1. **Multi-role Support:** Add editor, viewer roles
2. **Audit Logging:** Track all admin actions
3. **Bulk Operations:** Import/export team members
4. **Advanced Permissions:** Granular permission system
5. **Email Notifications:** Notify on important changes
6. **Activity Logs:** System activity tracking
7. **Backup System:** Automated database backups
8. **API Documentation:** Swagger/OpenAPI documentation

---

**Next Steps:** Begin with Phase 1 - Environment Setup & Dependencies installation.
