import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name_he: {
        type: String,
        required: [true, 'Hebrew name is required'],
        trim: true,
        maxlength: [100, 'Hebrew name cannot exceed 100 characters']
    },
    name_en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
        maxlength: [100, 'English name cannot exceed 100 characters']
    },
    description_he: {
        type: String,
        required: [true, 'Hebrew description is required']
    },
    description_en: {
        type: String,
        required: [true, 'English description is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [15, 'Duration must be at least 15 minutes'],
        max: [300, 'Duration cannot exceed 300 minutes']
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for ordering
serviceSchema.index({ active: 1, order: 1 });

export default mongoose.model('Service', serviceSchema);
