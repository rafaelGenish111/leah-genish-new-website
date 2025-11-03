import mongoose from 'mongoose';

const therapistAvailabilitySchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: [true, 'Day of week is required'],
        min: 0, // Sunday
        max: 6  // Saturday
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
        validate: {
            validator: function (endTime) {
                return endTime > this.startTime;
            },
            message: 'End time must be after start time'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    breakTimes: [{
        startTime: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
        },
        endTime: {
            type: String,
            required: true,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
            validate: {
                validator: function (endTime) {
                    return endTime > this.startTime;
                },
                message: 'End time must be after start time'
            }
        }
    }]
}, {
    timestamps: true
});

// Index for fast queries
therapistAvailabilitySchema.index({ dayOfWeek: 1 });

// Validate that end time is after start time for the day
therapistAvailabilitySchema.pre('save', function (next) {
    if (this.isModified('startTime') || this.isModified('endTime')) {
        if (this.endTime <= this.startTime) {
            next(new Error('End time must be after start time'));
            return;
        }
    }
    next();
});

export default mongoose.model('TherapistAvailability', therapistAvailabilitySchema);

