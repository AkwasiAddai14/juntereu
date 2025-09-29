import { MongoClient, ObjectId } from "mongodb";

// ----- Connection cache (belangrijk voor performance/cold starts) -----
let client: MongoClient | null = null;
let initialized = false;

type ShiftArray = Record<string, any>;

async function getDb() {
  if (!client) {
    // Use fallback values if environment variables are not available
    const mongoUrl = process.env.MONGODB_NL_URL || 'mongodb+srv://akwasivdsm:Drve33REtwzIqqXo@thejunter.83qsl.mongodb.net/Nederland?retryWrites=true&w=majority&appName=thejunter';
    const dbName = process.env.DB_NAME || 'Nederland';
    
    console.log('Environment variables check:');
    console.log('MONGODB_NL_URL:', process.env.MONGODB_NL_URL ? 'SET' : 'NOT SET (using fallback)');
    console.log('DB_NAME:', process.env.DB_NAME ? 'SET' : 'NOT SET (using fallback)');
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('MONGODB') || key.includes('DB')));
    
    client = new MongoClient(mongoUrl);
    await client.connect();
  }
  
  const dbName = process.env.DB_NAME || 'Nederland';
  const db = client.db(dbName);
  if (!initialized) {
    initialized = true;
    // Unieke index op hash (dedupe). 'sparse' zodat docs zonder hash niet falen.
    await db.collection("shiftarrays").createIndex({ hash: 1 }, { unique: true, sparse: true });
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
  const key = [doc.title, doc.adres, dateStr, doc.starting].join("|").toLowerCase();
  return crypto.createHash("sha1").update(key).digest("hex");
}

// ----- Handler -----
export default async function handler(req: any, res: any) {
  // Enable CORS for n8n requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-country');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check for API key (optional for development)
  if (process.env.API_KEY && req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Ensure body is an object
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Body must be a JSON object (the shiftArray doc).' });
    }

    // Accept both {doc: {...}} and raw {...}
    const doc: ShiftArray = (req.body.doc && typeof req.body.doc === 'object')
      ? req.body.doc
      : req.body;

    // Very light normalization (keep server strictness minimal)
    if (!doc.title || !doc.function || !doc.employerName) {
      return res.status(400).json({ error: 'Missing required fields: title, function, employerName' });
    }

    // Connectie met DB en collectie  
    const db = await getDb();
    const col = db.collection("shiftarrays");

    if (req.method === "GET") {
      // Healthcheck
      return res.json({ ok: true, timestamp: new Date().toISOString() });
    }

    // Payload klonen en casten
    const processedDoc = { ...doc };
    processedDoc.employer = toOid(processedDoc.employer);
    processedDoc.startingDate = toDate(processedDoc.startingDate);
    processedDoc.endingDate = toDate(processedDoc.endingDate);

    // Hash voor dedupe (title+adres+startdatum+starttijd)
    if (!processedDoc.hash) processedDoc.hash = makeHash(processedDoc);

    if (req.method === "POST") {
      // Insert (faalt bij duplicaat hash)
      processedDoc.createdAt = new Date();
      const r = await col.insertOne(processedDoc);
      return res.status(201).json({ 
        success: true,
        insertedId: r.insertedId,
        message: "Shift array created successfully"
      });
    }

    if (req.method === "PUT") {
      // Upsert (aanrader): update of insert wanneer nieuw
      const r = await col.findOneAndUpdate(
        { hash: processedDoc.hash },
        { $set: processedDoc, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      return res.json({
        success: true,
        data: r!.value,
        message: "Shift array updated successfully"
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error('API Error:', e);
    
    // Duplicate key error netjes teruggeven
    if (e?.code === 11000) {
      return res.status(409).json({ error: "Duplicate (hash already exists)" });
    }
    
    // MongoDB connection errors
    if (e?.name === 'MongoNetworkError' || e?.message?.includes('connection')) {
      return res.status(503).json({ error: "Database connection failed" });
    }
    
    return res.status(500).json({ 
      error: e?.message || String(e),
      type: e?.name || 'UnknownError'
    });
  }
}
