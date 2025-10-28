import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      try {
        console.log("UploadThing: Starting middleware");
        console.log("UploadThing: NODE_ENV:", process.env.NODE_ENV);
        console.log("UploadThing: UPLOADTHING_APP_ID:", process.env.UPLOADTHING_APP_ID ? "Set" : "Not set");
        console.log("UploadThing: UPLOADTHING_SECRET:", process.env.UPLOADTHING_SECRET ? "Set" : "Not set");
        
        // Try to get auth from Clerk
        const { userId } = await auth();
        
        if (!userId) {
          console.error("UploadThing: No userId found in auth");
          
          // Check if we're in development mode
          if (process.env.NODE_ENV === 'development') {
            console.log("UploadThing: Development mode - allowing upload without auth");
            return { userId: 'dev-user' };
          }
          
          // Try to get user from headers as fallback
          const headersList = await headers();
          const authHeader = headersList.get('authorization');
          if (authHeader) {
            console.log("UploadThing: Found auth header, allowing upload");
            return { userId: 'header-user' };
          }
          
          throw new Error("Unauthorized");
        }
        
        console.log("UploadThing: User authenticated", userId);
        return { userId };
      } catch (error) {
        console.error("UploadThing middleware error:", error);
        
        // For development, allow uploads even if auth fails
        if (process.env.NODE_ENV === 'development') {
          console.log("UploadThing: Development mode - allowing upload despite auth error");
          return { userId: 'dev-user' };
        }
        
        throw new Error("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("UploadThing: Upload completed successfully", metadata.userId, file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
