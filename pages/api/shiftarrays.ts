import { MongoClient, ObjectId } from "mongodb";

// ----- Connection cache (belangrijk voor performance/cold starts) -----
let client: MongoClient | null = null;
let initialized = false;

async function getDb() {
  if (!client) {
    // Try MONGODB_NL_URL first, fallback to MONGODB_URL if not available
    const mongoUrl = process.env.MONGODB_NL_URL || process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGODB_NL_URL or MONGODB_URL environment variable is not set. Please configure the database connection in your environment variables.");
    }
    client = new MongoClient(mongoUrl);
    await client.connect();
  }
  
  // Get database name from environment or extract from connection string
  let dbName = process.env.DB_NAME;
  if (!dbName) {
    // Try to extract from connection string or use default
    const mongoUrl = process.env.MONGODB_NL_URL || process.env.MONGODB_URL || "";
    const urlMatch = mongoUrl.match(/mongodb[^\/]*\/\/[^\/]+\/([^\/\?]+)/);
    dbName = urlMatch?.[1] || "Nederland"; // Default to "Nederland" if not found
  }
  
  const db = client.db(dbName);
  if (!initialized) {
    initialized = true;
    // Unieke index op hash (dedupe). 'sparse' zodat docs zonder hash niet falen.
    try {
      await db.collection("shiftarrays").createIndex({ hash: 1 }, { unique: true, sparse: true });
    } catch (indexError: any) {
      // Index might already exist, which is fine
      if (indexError?.code !== 85) { // 85 = IndexOptionsConflict
        console.warn("Index creation warning:", indexError.message);
      }
    }
  }
  return db;
}

// ----- Helpers -----
function toDate(v: any) {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + "T00:00:00Z");
  const d = new Date(v);
  return isNaN(+d) ? undefined : d;
}
function toOid(v: any) {
  return typeof v === "string" && /^[a-f0-9]{24}$/i.test(v) ? new ObjectId(v) : v;
}
import crypto from "crypto";
function makeHash(doc: any) {
  const dateStr =
    doc.startingDate instanceof Date
      ? doc.startingDate.toISOString().slice(0, 10)
      : (doc.startingDate || "");
  
  // Handle adres - can be string or object with {street, housenumber, postcode, city}
  let adresKey = "";
  if (doc.adres) {
    if (typeof doc.adres === 'string') {
      adresKey = doc.adres;
    } else if (typeof doc.adres === 'object' && doc.adres !== null) {
      // If adres is an object, format it as a string
      const addressParts = [
        doc.adres.street,
        doc.adres.housenumber,
        doc.adres.postcode,
        doc.adres.city
      ].filter(Boolean);
      adresKey = addressParts.join(" ");
    }
  }
  
  // Safely handle all values that might be undefined
  const key = [
    doc.title || "",
    adresKey,
    dateStr,
    doc.starting || ""
  ].join("|").toLowerCase();
  
  return crypto.createHash("sha1").update(key).digest("hex");
}

// ----- Handler -----
export default async function handler(req: any, res: any) {
  // Eenvoudige header-auth
   const apiKey = process.env.API_KEY;
  /*
  // Check if API_KEY is configured
  if (!apiKey) {
    const errorMsg = process.env.NODE_ENV === "production" 
      ? "Server configuration error: API_KEY not configured. Please set API_KEY in your environment variables."
      : "API_KEY not configured. Please set API_KEY in your environment variables for authentication.";
    
    console.error("API_KEY environment variable is not set");
    return res.status(500).json({ 
      error: errorMsg,
      hint: "Set API_KEY in your .env.local or environment variables, then include it in the 'x-api-key' header of your request."
    });
  } */
  
  // Validate API key header
  /* if (req.headers["x-api-key"] !== apiKey) {
    return res.status(401).json({ 
      error: "Unauthorized",
      hint: "Please include the 'x-api-key' header with the correct API key value."
    });
  } */

  try {
    const db = await getDb();
    const col = db.collection("shiftArrays");

    if (req.method === "GET") {
      // Healthcheck
      return res.json({ ok: true });
    }

    // Payload klonen en casten
    const doc = { ...(req.body || {}) };
    
    // Validate required fields
    if (!doc.title) {
      return res.status(400).json({ error: "Missing required field: title" });
    }
    
    doc.employer = toOid(doc.employer);
    doc.startingDate = toDate(doc.startingDate);
    doc.endingDate = toDate(doc.endingDate);

    // Hash voor dedupe (title+adres+startdatum+starttijd)
    // Ensure all values are safe before hashing
    try {
      if (!doc.hash) doc.hash = makeHash(doc);
    } catch (hashError: any) {
      console.error('Error creating hash:', hashError);
      return res.status(400).json({ 
        error: `Error creating hash: ${hashError.message || String(hashError)}` 
      });
    }

    if (req.method === "POST") {
      // Insert (faalt bij duplicaat hash)
      doc.createdAt = new Date();
      const r = await col.insertOne(doc);
      return res.status(201).json({ insertedId: r.insertedId });
    }

    if (req.method === "PUT") {
      // Upsert (aanrader): update of insert wanneer nieuw
      const r = await col.findOneAndUpdate(
        { hash: doc.hash },
        { $set: doc, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      return res.json(r!.value);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    // Duplicate key error netjes teruggeven
    if (e?.code === 11000) {
      return res.status(409).json({ error: "Duplicate (hash already exists)" });
    }
    return res.status(400).json({ error: e?.message || String(e) });
  }
}
