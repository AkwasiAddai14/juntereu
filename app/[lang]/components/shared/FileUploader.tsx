
import { useCallback, Dispatch, SetStateAction, useState } from 'react';
import { useDropzone } from '@uploadthing/react';
import { Button } from '@/app/[lang]/components/ui/button';
import { useUploadThing } from '@/app/lib/uploadthing';
import { generateClientDropzoneAccept } from 'uploadthing/client'

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const { startUpload } = useUploadThing("media");
  const [loading, setLoading] = useState(false); // Loading state

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setLoading(true);
    try {
      const uploadedFiles = await startUpload(acceptedFiles);
      if (uploadedFiles && uploadedFiles.length > 0) {
        onFieldChange(uploadedFiles[0].url); // Use the uploaded file URL
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [setFiles, onFieldChange, startUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" />

      { loading ? (
        <div className="flex-center flex-col py-5 text-grey-500">
          <svg
            className="animate-spin h-10 w-10 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="p-medium-12 mt-2">Uploading...</p>
        </div>
      ) : imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12">
            <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
          </svg>
          <h3 className="mb-2 mt-2">sleep foto hier</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Selecteer afbeelding
          </Button>
        </div>
      )}
    </div>
  );
}
