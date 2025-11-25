import { MongoClient, ObjectId } from "mongodb";
import crypto from "crypto";

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

// Generate date range between start and end dates (inclusive)
function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time to midnight for accurate day comparison
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

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
    const startingDate = toDate(doc.startingDate);
    const endingDate = toDate(doc.endingDate);
    
    // Validate dates
    if (!startingDate) {
      return res.status(400).json({ error: "Missing or invalid startingDate" });
    }
    
    // If endingDate is not provided, use startingDate (single day)
    const endDate = endingDate || startingDate;
    
    // Generate date range between startingDate and endingDate (inclusive)
    const dateRange = generateDateRange(startingDate, endDate);
    
    console.log(`Creating ${dateRange.length} shiftArray(s) for date range: ${startingDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    if (req.method === "POST") {
      // Insert multiple shiftArrays (one for each date in range)
      const results = [];
      const errors = [];
      
      for (const date of dateRange) {
        // Create a copy of the document for this specific date
        const dateDoc = {
          ...doc,
          startingDate: date,
          endingDate: date, // Each shiftArray is for a single day
          createdAt: new Date(),
        };
        
        // Generate hash for this specific date
        try {
          if (!dateDoc.hash) {
            dateDoc.hash = makeHash(dateDoc);
          }
        } catch (hashError: any) {
          console.error('Error creating hash:', hashError);
          errors.push({
            date: date.toISOString().split('T')[0],
            error: `Error creating hash: ${hashError.message || String(hashError)}`
          });
          continue;
        }
        
        try {
          const r = await col.insertOne(dateDoc);
          results.push({
            date: date.toISOString().split('T')[0],
            insertedId: r.insertedId.toString()
          });
        } catch (insertError: any) {
          // Handle duplicate key error
          if (insertError?.code === 11000) {
            errors.push({
              date: date.toISOString().split('T')[0],
              error: "Duplicate (hash already exists)"
            });
          } else {
            errors.push({
              date: date.toISOString().split('T')[0],
              error: insertError?.message || String(insertError)
            });
          }
        }
      }
      
      // Return results with success and error information
      if (results.length === 0) {
        return res.status(400).json({
          error: "Failed to create any shiftArrays",
          errors: errors
        });
      }
      
      return res.status(201).json({
        success: true,
        created: results.length,
        total: dateRange.length,
        insertedIds: results.map(r => r.insertedId),
        results: results,
        ...(errors.length > 0 && { errors: errors })
      });
    }

    if (req.method === "PUT") {
      // Upsert multiple shiftArrays (one for each date in range)
      const results = [];
      const errors = [];
      
      for (const date of dateRange) {
        // Create a copy of the document for this specific date
        const dateDoc = {
          ...doc,
          startingDate: date,
          endingDate: date, // Each shiftArray is for a single day
        };
        
        // Generate hash for this specific date
        try {
          if (!dateDoc.hash) {
            dateDoc.hash = makeHash(dateDoc);
          }
        } catch (hashError: any) {
          console.error('Error creating hash:', hashError);
          errors.push({
            date: date.toISOString().split('T')[0],
            error: `Error creating hash: ${hashError.message || String(hashError)}`
          });
          continue;
        }
        
        try {
          const r = await col.findOneAndUpdate(
            { hash: dateDoc.hash },
            { $set: dateDoc, $setOnInsert: { createdAt: new Date() } },
            { upsert: true, returnDocument: "after" }
          );
          results.push({
            date: date.toISOString().split('T')[0],
            _id: r!.value!._id.toString(),
            updated: r!.lastErrorObject?.updatedExisting || false
          });
        } catch (updateError: any) {
          errors.push({
            date: date.toISOString().split('T')[0],
            error: updateError?.message || String(updateError)
          });
        }
      }
      
      // Return results with success and error information
      if (results.length === 0) {
        return res.status(400).json({
          error: "Failed to update/insert any shiftArrays",
          errors: errors
        });
      }
      
      return res.json({
        success: true,
        processed: results.length,
        total: dateRange.length,
        results: results,
        ...(errors.length > 0 && { errors: errors })
      });
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
