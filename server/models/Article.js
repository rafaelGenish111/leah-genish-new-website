import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title_he: {
        type: String,
        required: [true, 'Hebrew title is required'],
        trim: true,
        maxlength: [200, 'Hebrew title cannot exceed 200 characters']
    },
    title_en: {
        type: String,
        required: [true, 'English title is required'],
        trim: true,
        maxlength: [200, 'English title cannot exceed 200 characters']
    },
    content_he: {
        type: String,
        required: [true, 'Hebrew content is required']
    },
    content_en: {
        type: String,
        required: [true, 'English content is required']
    },
    excerpt_he: {
        type: String,
        trim: true,
        maxlength: [500, 'Hebrew excerpt cannot exceed 500 characters']
    },
    excerpt_en: {
        type: String,
        trim: true,
        maxlength: [500, 'English excerpt cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['nutrition', 'holistic', 'lifestyle', 'reflexology', 'other'],
            message: 'Category must be one of: nutrition, holistic, lifestyle, reflexology, other'
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    featuredImage: {
        type: String,
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update updatedAt field before saving
articleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for better performance
articleSchema.index({ category: 1, published: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ title_he: 'text', title_en: 'text', content_he: 'text', content_en: 'text' });

export default mongoose.model('Article', articleSchema);
