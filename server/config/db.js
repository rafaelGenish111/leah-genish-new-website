import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache connection across serverless invocations
let cached = global.__mongooseConnection;
if (!cached) {
    cached = global.__mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // Disable buffering to fail fast if not connected
        mongoose.set('bufferCommands', false);

        cached.promise = mongoose
            .connect(process.env.MONGODB_URI)
            .then((conn) => {
                cached.conn = conn;
                console.log(`MongoDB Connected: ${conn.connection.host}`);
                return conn;
            })
            .catch((error) => {
                cached.promise = null;
                console.error('Database connection error:', error.message);
                throw error;
            });
    }

    return cached.promise;
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

// Graceful shutdown
if (process.env.NODE_ENV !== 'production') {
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
}

export default connectDB;
