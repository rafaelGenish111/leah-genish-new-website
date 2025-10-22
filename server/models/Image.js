import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    title_he: {
        type: String,
        trim: true,
        maxlength: [100, 'Hebrew title cannot exceed 100 characters']
    },
    title_en: {
        type: String,
        trim: true,
        maxlength: [100, 'English title cannot exceed 100 characters']
    },
    description_he: {
        type: String,
        trim: true,
        maxlength: [500, 'Hebrew description cannot exceed 500 characters']
    },
    description_en: {
        type: String,
        trim: true,
        maxlength: [500, 'English description cannot exceed 500 characters']
    },
    url: {
        type: String,
        required: [true, 'Image URL is required'],
        match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    publicId: {
        type: String,
        required: [true, 'Cloudinary public ID is required']
    },
    category: {
        type: String,
        enum: {
            values: ['clinic', 'treatments', 'events', 'certificates'],
            message: 'Category must be one of: clinic, treatments, events, certificates'
        },
        required: [true, 'Category is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for category filtering
imageSchema.index({ category: 1 });
imageSchema.index({ createdAt: -1 });

export default mongoose.model('Image', imageSchema);
