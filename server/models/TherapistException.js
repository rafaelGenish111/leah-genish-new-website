import mongoose from 'mongoose';

const therapistExceptionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    type: {
        type: String,
        required: [true, 'Exception type is required'],
        enum: {
            values: ['unavailable', 'custom_hours'],
            message: 'Type must be either "unavailable" or "custom_hours"'
        }
    },
    startTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
        required: function () {
            return this.type === 'custom_hours';
        }
    },
    endTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'],
        required: function () {
            return this.type === 'custom_hours';
        },
        validate: {
            validator: function (endTime) {
                if (this.type === 'custom_hours' && this.startTime) {
                    return endTime > this.startTime;
                }
                return true;
            },
            message: 'End time must be after start time'
        }
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
        maxlength: [500, 'Reason cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Index for date queries
therapistExceptionSchema.index({ date: 1 });
therapistExceptionSchema.index({ date: 1, type: 1 });

// Validate startTime and endTime are provided for custom_hours
therapistExceptionSchema.pre('save', function (next) {
    if (this.type === 'custom_hours') {
        if (!this.startTime || !this.endTime) {
            next(new Error('Start time and end time are required for custom_hours type'));
            return;
        }
        if (this.endTime <= this.startTime) {
            next(new Error('End time must be after start time'));
            return;
        }
    }
    next();
});

export default mongoose.model('TherapistException', therapistExceptionSchema);

