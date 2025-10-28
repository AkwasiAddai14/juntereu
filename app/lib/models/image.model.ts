import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImage extends Document {
    user: mongoose.Schema.Types.ObjectId; // Reference to the user who uploaded the image
    url: string; // The UploadThing URL
    filename?: string; // Original filename (optional)
    size?: number; // File size in bytes (optional)
    mimeType?: string; // MIME type of the image (optional)
    uploadedAt: Date; // When the image was uploaded
    isActive: boolean; // Whether the image is still active/available
    metadata?: {
        width?: number; // Image width in pixels
        height?: number; // Image height in pixels
        alt?: string; // Alt text for accessibility
        description?: string; // Optional description
    };
}

const imageSchema: Schema<IImage> = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer', // Reference to Employee model (you can change this to 'Employer' or create a generic 'User' model)
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true // Ensure each URL is unique
    },
    filename: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: false
    },
    mimeType: {
        type: String,
        required: false
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        width: {
            type: Number,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        alt: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for better query performance
imageSchema.index({ user: 1, uploadedAt: -1 });
// Note: url index is automatically created by unique: true
imageSchema.index({ isActive: 1 });

const Image: Model<IImage> = mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema);

export default Image;
