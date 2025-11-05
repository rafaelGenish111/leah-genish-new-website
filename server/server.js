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
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
// Trust the first proxy (e.g., Vercel) so req.ip is set correctly
app.set('trust proxy', 1);

app.use(helmet());

// CORS configuration (dynamic)
const allowedOrigins = (
    process.env.CLIENT_URLS?.split(',').map(s => s.trim()).filter(Boolean)
    || []
);
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}
const corsOpen = process.env.CORS_ALLOW_ALL === 'true';

const corsOptions = corsOpen
    ? {
        origin: true, // reflect request origin
        credentials: false, // cannot use '*' with credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204
    }
    : {
        origin: function(origin, callback) {
            if (!origin) return callback(null, true); // allow non-browser clients
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204
    };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    keyGenerator: (req) => {
        const xff = req.headers['x-forwarded-for'];
        if (typeof xff === 'string' && xff.length > 0) {
            return xff.split(',')[0].trim();
        }
        if (Array.isArray(xff) && xff.length > 0) {
            return String(xff[0]).split(',')[0].trim();
        }
        return (req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown');
    }
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global request timeout (avoid in serverless/Vercel runtime)
app.use((req, res, next) => {
    const isServerless = Boolean(process.env.VERCEL);
    const canSetTimeout = typeof res.setTimeout === 'function' && res.socket && typeof res.socket.setTimeout === 'function';
    if (!isServerless && canSetTimeout) {
        // 25s timeout
        res.setTimeout(25_000, () => {
            if (!res.headersSent) {
                res.status(504).json({ success: false, message: 'Request timed out' });
            }
        });
    }
    next();
});

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
app.use('/api/admin', adminRoutes);

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
            calendly: '/api/calendly',
            admin: '/api/admin'
        }
    });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server only in non-serverless environments
let server;
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', err);
    // Close server & exit process
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
    process.exit(1);
});

export default app;
