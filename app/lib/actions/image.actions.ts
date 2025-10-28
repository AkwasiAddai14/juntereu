"use server";

import { connectToDB } from '../mongoose';
import Image, { IImage } from '@/app/lib/models/image.model';
import mongoose from 'mongoose';

export interface CreateImageInput {
    user: string; // User ObjectId as string
    url: string; // UploadThing URL
    filename?: string;
    size?: number;
    mimeType?: string;
    metadata?: {
        width?: number;
        height?: number;
        alt?: string;
        description?: string;
    };
}

export interface UpdateImageInput {
    filename?: string;
    isActive?: boolean;
    metadata?: {
        width?: number;
        height?: number;
        alt?: string;
        description?: string;
    };
}

/**
 * Create a new image record
 */
export const createImage = async (input: CreateImageInput): Promise<IImage | null> => {
    try {
        await connectToDB();

        const newImage = new Image({
            user: new mongoose.Types.ObjectId(input.user),
            url: input.url,
            filename: input.filename,
            size: input.size,
            mimeType: input.mimeType,
            metadata: input.metadata,
            isActive: true
        });

        const savedImage = await newImage.save();
        return savedImage;
    } catch (error: any) {
        console.error('Error creating image:', error);
        throw new Error('Failed to create image record');
    }
};

/**
 * Get all images for a specific user
 */
export const getUserImages = async (userId: string): Promise<IImage[]> => {
    try {
        console.log('getUserImages called with userId:', userId);
        console.log('getUserImages userId type:', typeof userId);
        console.log('getUserImages userId length:', userId?.length);
        
        if (!userId) {
            console.log('No userId provided');
            return [];
        }

        await connectToDB();

        // First, try to find images directly associated with the user ID
        // But only if userId is a valid ObjectId format (24 hex characters)
        let images: any[] = [];
        
        if (mongoose.Types.ObjectId.isValid(userId)) {
            console.log('UserId is valid ObjectId, searching directly...');
            images = await Image.find({ 
                user: new mongoose.Types.ObjectId(userId),
                isActive: true 
            })
            .sort({ uploadedAt: -1 })
            .lean();
            console.log('Found images for user (direct):', images.length);
        } else {
            console.log('UserId is not valid ObjectId, skipping direct search...');
        }

        // If no images found, try to find images associated with the user's employer
        if (images.length === 0) {
            console.log('No images found for user, checking for employer images...');
            
            // Try to find the user as an employer using clerkId
            const Employer = require('../models/employer.model').default;
            const employer = await Employer.findOne({ clerkId: userId }).lean();
            
            if (employer) {
                console.log('Found employer for user:', employer._id);
                images = await Image.find({ 
                    user: new mongoose.Types.ObjectId(employer._id),
                    isActive: true 
                })
                .sort({ uploadedAt: -1 })
                .lean();
                console.log('Found images for employer:', images.length);
            } else {
                console.log('No employer found for clerkId:', userId);
            }
        }

        console.log('Total images found:', images.length);
        return images;
    } catch (error: any) {
        console.error('Error fetching user images:', error);
        console.error('Error details:', {
            message: error.message,
            userId: userId,
            userIdType: typeof userId,
            userIdLength: userId?.length
        });
        // Return empty array instead of throwing error to prevent form crashes
        return [];
    }
};

/**
 * Get a specific image by ID
 */
export const getImageById = async (imageId: string): Promise<IImage | null> => {
    try {
        await connectToDB();

        const image = await Image.findById(imageId).lean();
        return image;
    } catch (error: any) {
        console.error('Error fetching image by ID:', error);
        throw new Error('Failed to fetch image');
    }
};

/**
 * Get a specific image by URL
 */
export const getImageByUrl = async (url: string): Promise<IImage | null> => {
    try {
        await connectToDB();

        const image = await Image.findOne({ url }).lean();
        return image;
    } catch (error: any) {
        console.error('Error fetching image by URL:', error);
        throw new Error('Failed to fetch image by URL');
    }
};

/**
 * Update an image record
 */
export const updateImage = async (imageId: string, input: UpdateImageInput): Promise<IImage | null> => {
    try {
        await connectToDB();

        const updatedImage = await Image.findByIdAndUpdate(
            imageId,
            { 
                ...input,
                updatedAt: new Date()
            },
            { new: true }
        ).lean();

        return updatedImage;
    } catch (error: any) {
        console.error('Error updating image:', error);
        throw new Error('Failed to update image');
    }
};

/**
 * Soft delete an image (set isActive to false)
 */
export const deleteImage = async (imageId: string): Promise<boolean> => {
    try {
        await connectToDB();

        const result = await Image.findByIdAndUpdate(
            imageId,
            { 
                isActive: false,
                updatedAt: new Date()
            }
        );

        return !!result;
    } catch (error: any) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
};

/**
 * Hard delete an image (permanently remove from database)
 */
export const permanentlyDeleteImage = async (imageId: string): Promise<boolean> => {
    try {
        await connectToDB();

        const result = await Image.findByIdAndDelete(imageId);
        return !!result;
    } catch (error: any) {
        console.error('Error permanently deleting image:', error);
        throw new Error('Failed to permanently delete image');
    }
};

/**
 * Get images by multiple URLs (useful for batch operations)
 */
export const getImagesByUrls = async (urls: string[]): Promise<IImage[]> => {
    try {
        await connectToDB();

        const images = await Image.find({ 
            url: { $in: urls },
            isActive: true 
        }).lean();

        return images;
    } catch (error: any) {
        console.error('Error fetching images by URLs:', error);
        throw new Error('Failed to fetch images by URLs');
    }
};

/**
 * Get recent images for a user (with limit)
 */
export const getRecentUserImages = async (userId: string, limit: number = 10): Promise<IImage[]> => {
    try {
        await connectToDB();

        const images = await Image.find({ 
            user: new mongoose.Types.ObjectId(userId),
            isActive: true 
        })
        .sort({ uploadedAt: -1 })
        .limit(limit)
        .lean();

        return images;
    } catch (error: any) {
        console.error('Error fetching recent user images:', error);
        throw new Error('Failed to fetch recent user images');
    }
};

/**
 * Check if an image URL already exists for a user
 */
export const imageExistsForUser = async (userId: string, url: string): Promise<boolean> => {
    try {
        await connectToDB();

        const image = await Image.findOne({ 
            user: new mongoose.Types.ObjectId(userId),
            url,
            isActive: true 
        });

        return !!image;
    } catch (error: any) {
        console.error('Error checking if image exists:', error);
        return false;
    }
};

/**
 * Get all images for all employers
 */
export const getAllEmployerImages = async (): Promise<IImage[]> => {
    try {
        await connectToDB();

        // Get all employer IDs from the Employer collection
        const Employer = require('../models/employer.model').default;
        const employers = await Employer.find({}, '_id').lean();
        const employerIds = employers.map((emp: any) => emp._id);

        if (employerIds.length === 0) {
            return [];
        }

        // Get all images for these employers
        const images = await Image.find({
            user: { $in: employerIds },
            isActive: true
        })
        .populate('user', 'name displaynaam') // Populate employer details
        .sort({ uploadedAt: -1 })
        .lean();

        return images;
    } catch (error: any) {
        console.error('Error fetching all employer images:', error);
        throw new Error('Failed to fetch all employer images');
    }
};

/**
 * Get all images for all employees
 */
export const getAllEmployeeImages = async (): Promise<IImage[]> => {
    try {
        await connectToDB();

        // Get all employee IDs from the Employee collection
        const Employee = require('../models/employee.model').default;
        const employees = await Employee.find({}, '_id').lean();
        const employeeIds = employees.map((emp: any) => emp._id);

        if (employeeIds.length === 0) {
            return [];
        }

        // Get all images for these employees
        const images = await Image.find({
            user: { $in: employeeIds },
            isActive: true
        })
        .populate('user', 'name voornaam achternaam') // Populate employee details
        .sort({ uploadedAt: -1 })
        .lean();

        return images;
    } catch (error: any) {
        console.error('Error fetching all employee images:', error);
        throw new Error('Failed to fetch all employee images');
    }
};
