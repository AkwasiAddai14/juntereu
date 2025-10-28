// import { useCallback, Dispatch, SetStateAction, useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';                // ✅ juist
// import { useUploadThing, uploadFiles } from '@/app/lib/uploadthing';
// import { Button } from '@/app/[lang]/components/ui/button';
// import { generateClientDropzoneAccept } from 'uploadthing/client';

// type FileUploaderProps = {
//   onFieldChange: (url: string) => void;
//   imageUrl: string;
//   setFiles: Dispatch<SetStateAction<File[]>>;
// };

// export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
//   const { startUpload } = useUploadThing('media');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (imageUrl?.trim()) setLoading(false);
//   }, [imageUrl]);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     if (!acceptedFiles?.length) return;
//     if (acceptedFiles.length > 1) return alert('Upload één afbeelding tegelijk.');
//     const file = acceptedFiles[0];

//     if (file.size > 4 * 1024 * 1024) return alert('Max 4MB.');
//     if (!file.type.startsWith('image/')) return alert('Upload een afbeelding.');

//     setFiles([file]);
//     setLoading(true);

//     try {
//       // Eerst via startUpload (useUploadThing)
//       let res = await startUpload?.([file]);
//        // Fallback naar uploadFiles helper als res leeg is
//        if (!res || res.length === 0) {
//          res = await uploadFiles('media', { files: [file] });
//        }

//       if (res && res[0]?.url) {
//         onFieldChange(res[0].url);        // ✅ geef pure string terug aan RHF
//       } else {
//         console.warn('Geen URL ontvangen van upload endpoint.', res);
//         alert('Upload mislukt. Probeer opnieuw.');
//       }
//     } catch (e) {
//       console.error('Upload error:', e);
//       alert('Er ging iets mis tijdens het uploaden.');
//     } finally {
//       setLoading(false);
//     }
//   }, [onFieldChange, setFiles, startUpload]);

//   const { getRootProps, getInputProps, open } = useDropzone({
//     onDrop,
//     multiple: false,                                 // ✅ één bestand
//     accept: generateClientDropzoneAccept(['image/*']),
//     noClick: true,                                   // we gebruiken onze eigen knop
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
//     >
//       <input {...getInputProps()} />

//       {loading ? (
//         <div className="flex-center flex-col py-5 text-grey-500">
//           {/* spinner */}
//           <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//           </svg>
//           <p className="p-medium-12 mt-2">Uploading...</p>
//         </div>
//       ) : imageUrl?.trim() ? (
//         <div className="flex h-full w-full flex-1 justify-center">
//           <img
//             src={imageUrl}
//             alt="uploaded"
//             className="w-full h-full object-cover object-center rounded-lg"
//             onLoad={() => console.log('Image loaded:', imageUrl)}
//             onError={(e) => console.error('Image failed to load:', imageUrl, e)}
//           />
//         </div>
//       ) : (
//         <div className="flex-center flex-col py-5 text-grey-500">
//           <h3 className="mb-2 mt-2">Drag image here</h3>
//           <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
//           <Button type="button" className="rounded-full" onClick={open}>
//             Select image
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/app/lib/uploadthing";
import { generateClientDropzoneAccept } from "uploadthing/client";

type Props = {
  imageUrl: string;
  onFieldChange: (url: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export function FileUploader({ imageUrl, onFieldChange, setFiles }: Props) {
  const [loading, setLoading] = useState(false);

  const { startUpload, isUploading } = useUploadThing("media", {
    onClientUploadComplete: (files) => {
      // ✅ Use ufsUrl instead of deprecated url
      const file = files?.[0];
      const url = file?.ufsUrl || file?.url || (file?.key ? `https://utfs.io/f/${file.key}` : "");
      if (url) onFieldChange(url);
      setLoading(false);
    },
    onUploadError: (e) => {
      console.error(e);
      alert("Upload mislukt.");
      setLoading(false);
    },
  });

  useEffect(() => {
    if (imageUrl?.trim()) setLoading(false);
  }, [imageUrl]);

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted.length) return;
    const file = accepted[0];
    if (file.size > 4 * 1024 * 1024) return alert("Max 4MB.");
    if (!file.type.startsWith("image/")) return alert("Upload een afbeelding.");
    setFiles([file]);
    setLoading(true);
    await startUpload?.([file]); // 🔥 dit triggert de PUT + callbacks
  }, [setFiles, startUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: generateClientDropzoneAccept(["image/*"]),
    noClick: true,
  });

  const busy = loading || isUploading;
/* border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors */
  return (
    <div {...getRootProps()} className="flex-center h-72 rounded-xl bg-grey-50 overflow-hidden">
      <input {...getInputProps()} />
      {busy ? (
        <div className="flex-center flex-col py-5 text-grey-500">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-transparent" />
          <p className="mt-2">Uploading...</p>
        </div>
      ) : imageUrl?.trim() ? (
        <div className="w-full h-full flex items-center justify-center p-2">
          <img 
            src={imageUrl} 
            alt="uploaded" 
            className="w-full h-full object-cover rounded-lg shadow-sm" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className="mb-2 text-lg font-medium">Drag image here</h3>
          <p className="mb-4 text-sm text-gray-500">SVG, PNG, JPG</p>
          <button type="button" className="rounded-full px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={open}>
            Select image
          </button>
        </div>
      )}
    </div>
  );
}
