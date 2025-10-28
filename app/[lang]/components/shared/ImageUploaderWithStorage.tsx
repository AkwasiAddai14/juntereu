"use client";

import { useState } from 'react';
import { useUploadThing } from '@/app/lib/uploadthing';
import { useImageManager } from '@/app/lib/hooks/useImageManager';
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { Button } from '@/app/[lang]/components/ui/button';
import { Input } from '@/app/[lang]/components/ui/input';
import { Label } from '@/app/[lang]/components/ui/label';
// Card components replaced with div elements
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderWithStorageProps {
    onImageUploaded?: (imageUrl: string) => void;
    maxImages?: number;
    showImageList?: boolean;
    userId: string;
}

export const ImageUploaderWithStorage: React.FC<ImageUploaderWithStorageProps> = ({
    onImageUploaded,
    maxImages = 10,
    showImageList = true,
    userId
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imageMetadata, setImageMetadata] = useState({
        alt: '',
        description: ''
    });

    const { startUpload } = useUploadThing("media");
    const { images, loading, error, uploadImage, removeImage, checkImageExists } = useImageManager();
    const { toast } = useToast();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: "No files selected",
                description: "Please select at least one image to upload.",
                variant: "destructive"
            });
            return;
        }

        if (images.length + files.length > maxImages) {
            toast({
                title: "Too many images",
                description: `You can only upload up to ${maxImages} images.`,
                variant: "destructive"
            });
            return;
        }

        setUploading(true);

        try {
            // Upload files to UploadThing
            const uploadedFiles = await startUpload(files);

            if (!uploadedFiles || uploadedFiles.length === 0) {
                throw new Error('No files were uploaded');
            }

            // Create image records in database
            const uploadPromises = uploadedFiles.map(async (file) => {
                // Check if image already exists
                const exists = await checkImageExists(file.url);
                if (exists) {
                    toast({
                        title: "Image already exists",
                        description: "This image has already been uploaded.",
                        variant: "default"
                    });
                    return null;
                }

                // Create image record
                const imageRecord = await uploadImage({
                    user: userId,
                    url: file.url,
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type,
                    metadata: {
                        alt: imageMetadata.alt || file.name,
                        description: imageMetadata.description
                    }
                });

                return imageRecord;
            });

            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(Boolean);

            if (successfulUploads.length > 0) {
                toast({
                    title: "Images uploaded successfully",
                    description: `${successfulUploads.length} image(s) uploaded and saved.`,
                    variant: "default"
                });

                // Call callback with the first uploaded image URL
                if (onImageUploaded && successfulUploads[0]) {
                    onImageUploaded(successfulUploads[0].url);
                }
            }

            // Clear files and metadata
            setFiles([]);
            setImageMetadata({ alt: '', description: '' });

        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload images. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async (imageId: string) => {
        try {
            const success = await removeImage(imageId);
            if (success) {
                toast({
                    title: "Image removed",
                    description: "The image has been removed from your collection.",
                    variant: "default"
                });
            }
        } catch (error: any) {
            toast({
                title: "Failed to remove image",
                description: error.message || "Could not remove the image.",
                variant: "destructive"
            });
        }
    };

    if (error) {
        return (
            <div className="w-full border border-red-200 rounded-lg p-6 bg-red-50">
                <div className="text-center text-red-600">
                    <p>Error loading images: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Upload Images
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <Label htmlFor="image-upload">Select Images</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            You can upload up to {maxImages} images. Current: {images.length}/{maxImages}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="alt-text">Alt Text (optional)</Label>
                            <Input
                                id="alt-text"
                                value={imageMetadata.alt}
                                onChange={(e) => setImageMetadata(prev => ({ ...prev, alt: e.target.value }))}
                                placeholder="Describe the image for accessibility"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                value={imageMetadata.description}
                                onChange={(e) => setImageMetadata(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Additional description"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload {files.length} Image(s)
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Image List */}
            {showImageList && (
                <div className="border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Your Images ({images.length})</h3>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="ml-2">Loading images...</span>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No images uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((image) => (
                                    <div key={image._id as string} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={image.url}
                                                alt={image.metadata?.alt || image.filename || 'Uploaded image'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveImage(image._id as string)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium truncate">
                                                {image.filename || 'Untitled'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(image.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
