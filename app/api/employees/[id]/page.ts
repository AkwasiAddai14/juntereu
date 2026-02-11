// api/employees/[id].ts  (or pages/api/employees/[id].ts)
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/mongoose";

function sanitizeEmployee(input: any) {
  const allowed = ["clerkId", "firstname", "infix", "lastname", "email", "phone", "street", "housenumber", "postcode", "city", "country", "profilePhoto", "bio", "skills", "experience", "education"];
  const out: Record<string, unknown> = {};
  for (const k of allowed) {
    if (input != null && typeof input[k] !== "undefined") out[k] = input[k];
  }
  return out;
}

const toOid = (v: any) =>
  (typeof v === "string" && /^[a-f0-9]{24}$/i.test(v)) ? new ObjectId(v) : null;

export default async function handler(req: any, res: any) {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = req.query.id as string; // dynamic segment [id]
  if (!id) return res.status(400).json({ error: "id is required" });

  if (req.method !== "PATCH" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = req.body || {};
    const doc = sanitizeEmployee(body);
    if (!doc.clerkId) {
      return res.status(400).json({ error: "clerkId is required" });
    }

    await connectToDB();
    const db = mongoose.connection.db;
    if (!db) return res.status(503).json({ error: "Database not connected" });
    const col = db.collection("employees");

    await col.createIndex({ clerkId: 1 }, { unique: true }).catch(() => {});

    const oid = toOid(id);
    const filter = oid
      ? { _id: oid }
      : { clerkId: doc.clerkId };

    const r = await col.findOneAndUpdate(
      filter,
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );
    return res.json(r!.value);
  } catch (e: any) {
    if (e?.code === 11000) {
      return res.status(409).json({ error: "Duplicate (clerkId already exists)" });
    }
    return res.status(400).json({ error: e?.message || String(e) });
  }
}