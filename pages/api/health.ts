import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-country');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envCheck = {
      MONGODB_NL_URL: !!process.env.MONGODB_NL_URL,
      DB_NAME: !!process.env.DB_NAME,
      API_KEY: !!process.env.API_KEY,
    };

    // Get all MongoDB and DB related environment variables
    const mongoEnvVars = Object.keys(process.env).filter(key => 
      key.includes('MONGODB') || key.includes('DB') || key.includes('MONGO')
    );

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      mongoEnvVars: mongoEnvVars,
      message: 'API is running and accessible'
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
