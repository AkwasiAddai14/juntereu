// app/api/employees/[id]/route.ts
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/app/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
// ... your imports and helpers ...


function sanitizeEmployee(input: any) {
  const allowed = [
    "clerkId", "firstname", "infix", "lastname", "email", "phone",
    "street", "housenumber", "postcode", "city", "country",
    "profilephoto", "profilePhoto", "bio", "skills", "experience", "education",
    "onboarded", "dateOfBirth", "rating", "ratingCount", "attendance", "punctuality",
    "VATidnr", "companyRegistrationNumber", "SocialSecurity", "iban"
  ];
  const out: Record<string, unknown> = {};
  if (input == null || typeof input !== "object") return out;
  for (const k of allowed) {
    if (typeof input[k] !== "undefined") out[k] = input[k];
  }
  return out;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = request.headers;
  const apiKey = headers.get("x-api-key");
  if (apiKey !== process.env.API_KEY) {
    console.log("Unauthorized access attempt with API key:", apiKey);
    console.log("Expected API Key:", process.env.API_KEY);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;  // id comes from here, not req.query
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (request.method !== "PATCH" && request.method !== "PUT") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const doc = sanitizeEmployee(body ?? {});
    if (!doc.clerkId) {
      return NextResponse.json({ error: "clerkId is required" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }
    const col = db.collection("employees");

    await col.createIndex({ clerkId: 1 }, { unique: true }).catch(() => {});

    const toOid = (v: any) =>
      (typeof v === "string" && /^[a-f0-9]{24}$/i.test(v)) ? new ObjectId(v) : null;
    const oid = toOid(id);
    const filter = oid ? { _id: oid } : { clerkId: doc.clerkId };

    const r = await col.findOneAndUpdate(
      filter,
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );

    const resultDoc = r && typeof r === "object" && "value" in r
      ? (r as { value?: unknown }).value
      : r;
    return NextResponse.json(resultDoc ?? null);
  } catch (e: any) {
    if (e?.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate (clerkId already exists)" },
        { status: 409 }
      );
    }
    console.error("PATCH /api/employees/[id] error:", e?.message || e);
    return NextResponse.json(
      { error: e?.message || String(e) },
      { status: 500 }
    );
  }
}


// // api/employees/[id].ts  (or pages/api/employees/[id].ts)
// import { ObjectId } from "mongodb";
// import mongoose from "mongoose";
// import { connectToDB } from "@/app/lib/mongoose";


// const toOid = (v: any) =>
//   (typeof v === "string" && /^[a-f0-9]{24}$/i.test(v)) ? new ObjectId(v) : null;

// export default async function handler(req: any, res: any) {
//   const headers = req?.headers;
// const apiKey = headers != null
//   ? (typeof headers.get === "function" ? headers.get("x-api-key") : headers["x-api-key"])
//   : undefined;
// if (apiKey !== process.env.API_KEY) {
//   return res.status(401).json({ error: "Unauthorized" });
// }

//   const id = req.query.id as string;
//   if (!id) return res.status(400).json({ error: "id is required" });

//   if (req.method !== "PATCH" && req.method !== "PUT") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const body = req.body || {};
//     const doc = sanitizeEmployee(body);
//     if (!doc.clerkId) {
//       return res.status(400).json({ error: "clerkId is required" });
//     }

//     await connectToDB();
//     const db = mongoose.connection.db;
//     if (!db) return res.status(503).json({ error: "Database not connected" });
//     const col = db.collection("employees");

//     await col.createIndex({ clerkId: 1 }, { unique: true }).catch(() => {});

//     const oid = toOid(id);
//     const filter = oid
//       ? { _id: oid }
//       : { clerkId: doc.clerkId };

//     const r = await col.findOneAndUpdate(
//       filter,
//       { $set: doc, $setOnInsert: { createdAt: new Date() } },
//       { upsert: true, returnDocument: "after" }
//     );

//     // Driver 4.x: r.value; 5+/6: sometimes r is the document
//     const resultDoc = r && typeof r === "object" && "value" in r
//       ? (r as { value?: unknown }).value
//       : r;
//     return res.json(resultDoc ?? null);
//   } catch (e: any) {
//     if (e?.code === 11000) {
//       return res.status(409).json({ error: "Duplicate (clerkId already exists)" });
//     }
//     console.error("PATCH /api/employees/[id] error:", e?.message || e);
//     return res.status(500).json({ error: e?.message || String(e) });
//   }
// }

