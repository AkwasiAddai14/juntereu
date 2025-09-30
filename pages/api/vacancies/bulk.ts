import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// ---------- Connection cache ----------
let client: MongoClient | null = null;
let initialized = false;

async function getDb() {
  if (!client) {
    // Use fallback values if environment variables are not available
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_NL_URL || 'mongodb+srv://akwasivdsm:Drve33REtwzIqqXo@thejunter.83qsl.mongodb.net/Nederland?retryWrites=true&w=majority&appName=thejunter';
    
    console.log('Vacancies Bulk API - Environment variables check:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
    console.log('MONGODB_NL_URL:', process.env.MONGODB_NL_URL ? 'SET' : 'NOT SET');
    console.log('Using fallback:', !process.env.MONGO_URI && !process.env.MONGODB_NL_URL);
    
    client = new MongoClient(mongoUrl);
    await client.connect();
  }
  
  const dbName = process.env.DB_NAME || 'Nederland';
  const db = client.db(dbName);
  if (!initialized) {
    initialized = true;
    // Unieke index op hash voor dedupe (sparse => niet verplicht)
    await db.collection("vacancies").createIndex({ hash: 1 }, { unique: true, sparse: true });
    // Handige zoekindexen (optioneel):
    await db.collection("vacancies").createIndex({ "adres.city": 1, startingDate: 1 }, { sparse: true });
    await db.collection("vacancies").createIndex({ title: "text", function: "text", description: "text" });
  }
  return db;
}

// ---------- Helpers ----------
const toOid = (v: any) =>
  typeof v === "string" && /^[a-f0-9]{24}$/i.test(v) ? new ObjectId(v) : v;

function toDate(v: any) {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + "T00:00:00Z");
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v);
  return new Date(v);
}

function createHash(doc: any): string {
  // Create a hash based on key fields to prevent duplicates
  const keyFields = {
    title: doc.title,
    employerName: doc.employerName,
    function: doc.function,
    city: doc.adres?.city,
    startingDate: doc.startingDate,
    hourlyRate: doc.hourlyRate
  };
  return Buffer.from(JSON.stringify(keyFields)).toString('base64');
}

function cleanVacancyData(doc: any) {
  return {
    ...doc,
    _id: toOid(doc._id),
    startingDate: toDate(doc.startingDate),
    endingDate: toDate(doc.endingDate),
    createdAt: new Date(),
    updatedAt: new Date(),
    hash: createHash(doc),
    // Ensure required fields have defaults
    employer: doc.employer || "",
    applications: doc.applications || [],
    jobs: doc.jobs || [],
    available: doc.available !== undefined ? doc.available : true,
    surcharges: doc.surcharges || [],
    label: doc.label || ""
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS for n8n requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-country');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const collection = db.collection("vacancies");

    // Get the array of vacancy documents from the request body
    const vacancyData = req.body;
    
    if (!Array.isArray(vacancyData)) {
      return res.status(400).json({ 
        error: 'Request body must be an array of vacancy documents',
        received: typeof vacancyData
      });
    }

    console.log(`Processing ${vacancyData.length} vacancy documents`);

    // Clean and prepare the data
    const cleanedVacancies = vacancyData.map(item => {
      if (item.doc) {
        return cleanVacancyData(item.doc);
      }
      return cleanVacancyData(item);
    });

    // Use insertMany with ordered: false to continue on duplicates
    const result = await collection.insertMany(cleanedVacancies, { 
      ordered: false 
    });

    console.log(`Successfully inserted ${result.insertedCount} out of ${vacancyData.length} vacancies`);

    return res.status(200).json({
      success: true,
      insertedCount: result.insertedCount,
      totalCount: vacancyData.length,
      message: `Successfully processed ${result.insertedCount} vacancies`,
      insertedIds: Object.values(result.insertedIds)
    });

  } catch (error: any) {
    console.error('Bulk vacancy insertion error:', error);
    
    // Handle specific MongoDB errors
    if (error?.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'Some vacancies were duplicates and skipped',
        error: 'Duplicate key error - some vacancies already exist'
      });
    }

    // MongoDB connection errors
    if (error?.name === 'MongoNetworkError' || error?.message?.includes('connection')) {
      return res.status(503).json({ error: "Database connection failed" });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
