"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
    createImage, 
    getUserImages, 
    updateImage, 
    deleteImage,
    getRecentUserImages,
    imageExistsForUser,
    type CreateImageInput,
    type UpdateImageInput
} from '@/app/lib/actions/image.actions';
import { IImage } from '@/app/lib/models/image.model';

export interface UseImageManagerReturn {
    images: IImage[];
    loading: boolean;
    error: string | null;
    uploadImage: (input: CreateImageInput) => Promise<IImage | null>;
    updateImageRecord: (imageId: string, input: UpdateImageInput) => Promise<IImage | null>;
    removeImage: (imageId: string) => Promise<boolean>;
    refreshImages: () => Promise<void>;
    checkImageExists: (url: string) => Promise<boolean>;
}

export const useImageManager = (limit?: number): UseImageManagerReturn => {
    const { user, isLoaded } = useUser();
    const [images, setImages] = useState<IImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user images
    const fetchImages = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const userImages = limit 
                ? await getRecentUserImages(user.id, limit)
                : await getUserImages(user.id);
            
            setImages(userImages);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch images');
            console.error('Error fetching images:', err);
        } finally {
            setLoading(false);
        }
    };

    // Upload a new image
    const uploadImage = async (input: CreateImageInput): Promise<IImage | null> => {
        if (!user?.id) {
            setError('User not authenticated');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const newImage = await createImage({
                ...input,
                user: user.id
            });

            if (newImage) {
                setImages(prev => [newImage, ...prev]);
            }

            return newImage;
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
            console.error('Error uploading image:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update an image record
    const updateImageRecord = async (imageId: string, input: UpdateImageInput): Promise<IImage | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedImage = await updateImage(imageId, input);

            if (updatedImage) {
                setImages(prev => 
                    prev.map(img => 
                        img._id === imageId ? updatedImage : img
                    )
                );
            }

            return updatedImage;
        } catch (err: any) {
            setError(err.message || 'Failed to update image');
            console.error('Error updating image:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Remove an image (soft delete)
    const removeImage = async (imageId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await deleteImage(imageId);

            if (success) {
                setImages(prev => prev.filter(img => img._id !== imageId));
            }

            return success;
        } catch (err: any) {
            setError(err.message || 'Failed to delete image');
            console.error('Error deleting image:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Check if an image URL already exists for the user
    const checkImageExists = async (url: string): Promise<boolean> => {
        if (!user?.id) return false;

        try {
            return await imageExistsForUser(user.id, url);
        } catch (err: any) {
            console.error('Error checking image existence:', err);
            return false;
        }
    };

    // Refresh images
    const refreshImages = async () => {
        await fetchImages();
    };

    // Load images when user is available
    useEffect(() => {
        if (isLoaded && user?.id) {
            fetchImages();
        }
    }, [isLoaded, user?.id, limit]);

    return {
        images,
        loading,
        error,
        uploadImage,
        updateImageRecord,
        removeImage,
        refreshImages,
        checkImageExists
    };
};
