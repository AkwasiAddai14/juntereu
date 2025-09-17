// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server"; // server-only import

const f = createUploadthing();

export const ourFileRouter = {
  // Change config as you like
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // This runs in request scope (safe to call auth() here)
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      // Available in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      // persist to DB if you want
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
