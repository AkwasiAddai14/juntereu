'use client'

import { useCallback } from 'react';
import { useUploadThing } from '@/app/lib/uploadthing';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';

interface ProfilePhotoUploaderProps {
  imageUrl: string;
  onFieldChange: (url: string) => void;
  setFiles: (files: File[]) => void;
  loading: boolean;
}

export function ProfilePhotoUploader({ imageUrl, onFieldChange, setFiles, loading }: ProfilePhotoUploaderProps) {
  const { startUpload } = useUploadThing("media");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    try {
      const uploadedFiles = await startUpload(acceptedFiles);
      if (uploadedFiles && uploadedFiles.length > 0) {
        onFieldChange(uploadedFiles[0].url);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [setFiles, onFieldChange, startUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Uploading...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {imageUrl ? 'Change Photo' : 'Upload Photo'}
        </div>
      )}
    </div>
  );
}
