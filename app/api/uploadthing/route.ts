import { createUploadthing, type FileRouter } from "uploadthing/server";
import { createRouteHandler } from "uploadthing/next";
// import { auth } from "@clerk/nextjs"; // als je auth wil; optioneel

const f = createUploadthing();

export const ourFileRouter = {
  media: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // const userId = auth().userId ?? "dev"; // optioneel
      return { userId: "dev" };
    })
    .onUploadComplete(async ({ file /*, metadata*/ }) => {
      // Belangrijk: geef URL terug (UploadThing host → utfs.io)
      return {
        url: file.url,    // bv. https://utfs.io/f/<key>
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { POST, GET } = createRouteHandler({ router: ourFileRouter });

