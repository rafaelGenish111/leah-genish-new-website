import mongoose from 'mongoose';

const healthDeclarationSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    clientEmail: {
        type: String,
        required: [true, 'Client email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    clientPhone: {
        type: String,
        required: [true, 'Client phone is required'],
        trim: true,
        match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function (date) {
                return date < new Date();
            },
            message: 'Date of birth must be in the past'
        }
    },
    medicalConditions: [{
        type: String,
        trim: true
    }],
    allergies: [{
        type: String,
        trim: true
    }],
    medications: [{
        type: String,
        trim: true
    }],
    surgeries: [{
        type: String,
        trim: true
    }],
    pregnant: {
        type: Boolean,
        default: false
    },
    additionalInfo: {
        type: String,
        trim: true,
        maxlength: [1000, 'Additional info cannot exceed 1000 characters']
    },
    signature: {
        type: String,
        required: [true, 'Digital signature is required']
    },
    consentGiven: {
        type: Boolean,
        required: [true, 'Consent must be given'],
        validate: {
            validator: function (value) {
                return value === true;
            },
            message: 'Consent must be explicitly given'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for searching by client info
healthDeclarationSchema.index({ clientName: 'text', clientEmail: 'text' });
healthDeclarationSchema.index({ createdAt: -1 });

export default mongoose.model('HealthDeclaration', healthDeclarationSchema);
