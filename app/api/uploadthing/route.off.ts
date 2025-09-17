// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Never call auth()/headers() at module top-level here.
// Just wire the router to the handler:
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });

// Make sure this route is always request-bound (no prerender)
export const dynamic = "force-dynamic";
export const revalidate = 0;
// If you run into edge/runtime issues, you can force Node:
export const runtime = "nodejs";
