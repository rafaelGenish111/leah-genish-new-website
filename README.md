# Leah Genish - Holistic Health Website

A comprehensive website for Leah Genish, a complementary medicine practitioner specializing in reflexology, holistic treatment, and natural nutrition.

## Features

### Backend (Node.js + Express)
- **Authentication System**: JWT-based authentication with role-based access control
- **Articles Management**: Full CRUD operations for articles with Hebrew/English support
- **Appointment Booking**: Complete appointment system with email notifications
- **Health Declarations**: Digital health forms with signature capture
- **Gallery Management**: Image upload and management with Cloudinary integration
- **Services Management**: Treatment services with pricing and duration
- **Contact System**: Contact form with email notifications
- **Security**: Helmet, CORS, rate limiting, input validation
- **Email System**: Automated email notifications for appointments and contact

### Frontend (React + MUI)
- **Responsive Design**: Mobile-first design with Material-UI components
- **Bilingual Support**: Hebrew (RTL) and English (LTR) with i18next
- **Authentication**: Login/logout with protected routes
- **Admin Dashboard**: Complete admin panel for content management
- **Modern UI**: Beautiful, accessible interface with animations
- **SEO Optimized**: Proper meta tags and semantic HTML

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Nodemailer for email notifications
- Express-validator for input validation
- Helmet for security
- Express-rate-limit for rate limiting

### Frontend
- React 18 with Vite
- Material-UI (MUI) for components
- React Router for navigation
- i18next for internationalization
- Axios for API calls
- Framer Motion for animations
- React Hook Form for form handling

## Project Structure

```
leah-genish-website/
├── server/                 # Backend application
│   ├── config/            # Database and Cloudinary configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service functions
│   │   ├── i18n/          # Internationalization
│   │   ├── theme/         # MUI theme configuration
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Email service (Gmail/SMTP)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/leah-genish
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
CLIENT_URL=http://localhost:3030
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_APP_NAME=Leah Genish - Holistic Health
VITE_APP_VERSION=1.0.0
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/register` - Register new admin (admin only)

### Articles
- `GET /api/articles` - Get published articles (public)
- `GET /api/articles/admin` - Get all articles (admin)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/:id` - Update article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)
- `PUT /api/articles/:id/publish` - Publish/unpublish article (admin)
- `POST /api/articles/:id/increment-views` - Increment view count (public)

### Appointments
- `GET /api/appointments` - Get all appointments (admin)
- `GET /api/appointments/available-slots` - Get available time slots (public)
- `GET /api/appointments/:id` - Get single appointment (admin)
- `POST /api/appointments` - Create appointment (public)
- `PUT /api/appointments/:id` - Update appointment (admin)
- `DELETE /api/appointments/:id` - Cancel appointment (public with token or admin)
- `PUT /api/appointments/:id/status` - Update status (admin)
- `PUT /api/appointments/:id/arrived` - Mark as arrived (admin)

### Health Declarations
- `GET /api/health` - Get all declarations (admin)
- `GET /api/health/:id` - Get single declaration (admin)
- `POST /api/health` - Submit declaration (public)
- `DELETE /api/health/:id` - Delete declaration (admin)
- `GET /api/health/export/:id` - Export as PDF (admin)

### Gallery
- `GET /api/gallery` - Get all images (public)
- `GET /api/gallery/:id` - Get single image (public)
- `POST /api/gallery` - Upload images (admin)
- `PUT /api/gallery/:id` - Update image details (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Services
- `GET /api/services` - Get all active services (public)
- `GET /api/services/admin` - Get all services (admin)
- `GET /api/services/:id` - Get single service (public)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Contact
- `POST /api/contact` - Send contact message (public)

## Database Models

### User
- email (unique, required)
- password (hashed, required)
- name (required)
- role (default: 'admin')
- createdAt

### Article
- title_he, title_en (required)
- content_he, content_en (required)
- excerpt_he, excerpt_en
- category (required)
- tags (array)
- featuredImage (Cloudinary URL)
- author (ref to User)
- published (boolean, default: false)
- views (number, default: 0)
- createdAt, updatedAt

### Appointment
- clientName, clientEmail, clientPhone (required)
- serviceType (ref to Service, required)
- date, time (required)
- duration (number)
- status (enum: pending, confirmed, cancelled, completed)
- notes
- arrived (boolean, default: false)
- confirmationToken
- createdAt

### HealthDeclaration
- clientName, clientEmail, clientPhone (required)
- dateOfBirth
- medicalConditions, allergies, medications, surgeries (arrays)
- pregnant (boolean)
- additionalInfo
- signature (digital signature data)
- consentGiven (boolean, required)
- createdAt

### Image
- title_he, title_en
- description_he, description_en
- url (Cloudinary URL, required)
- publicId (Cloudinary public ID, required)
- category (enum: clinic, treatments, events, certificates)
- uploadedBy (ref to User)
- createdAt

### Service
- name_he, name_en (required)
- description_he, description_en (required)
- duration (number, required, in minutes)
- price (number)
- active (boolean, default: true)
- image (Cloudinary URL)
- order (number, for display ordering)

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- SQL injection prevention
- XSS protection

## Email Templates

The system includes comprehensive email templates in both Hebrew and English for:
- Appointment confirmations
- Appointment reminders
- Appointment cancellations
- Status updates
- Health declaration confirmations
- Contact form notifications
- Admin notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support and questions, please contact the development team.

---

**Note**: This is a complete full-stack application with both backend and frontend implementations. Make sure to configure all environment variables properly before running the application.
