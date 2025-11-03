import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import appointmentsRoutes from './routes/appointments.js';
import healthRoutes from './routes/health.js';
import galleryRoutes from './routes/gallery.js';
import servicesRoutes from './routes/services.js';
import contactRoutes from './routes/contact.js';
import availabilityRoutes from './routes/availability.js';
import calendlyRoutes from './routes/calendly.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3030',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    }
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendly', calendlyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Leah Genish API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            articles: '/api/articles',
            appointments: '/api/appointments',
            health: '/api/health',
            gallery: '/api/gallery',
            services: '/api/services',
            contact: '/api/contact',
            availability: '/api/availability',
            calendly: '/api/calendly'
        }
    });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', err);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
    process.exit(1);
});

export default app;
