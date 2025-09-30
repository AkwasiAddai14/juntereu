import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS for n8n requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-country');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vacancyData = req.body;
    
    console.log('Test bulk endpoint received:', {
      isArray: Array.isArray(vacancyData),
      length: Array.isArray(vacancyData) ? vacancyData.length : 'not array',
      firstItem: Array.isArray(vacancyData) && vacancyData.length > 0 ? vacancyData[0] : 'no items'
    });

    return res.status(200).json({
      success: true,
      message: 'Test endpoint working',
      receivedData: {
        isArray: Array.isArray(vacancyData),
        length: Array.isArray(vacancyData) ? vacancyData.length : 'not array',
        sampleItem: Array.isArray(vacancyData) && vacancyData.length > 0 ? {
          hasDoc: !!vacancyData[0].doc,
          title: vacancyData[0].doc?.title || vacancyData[0].title,
          employerName: vacancyData[0].doc?.employerName || vacancyData[0].employerName
        } : null
      }
    });

  } catch (error: any) {
    console.error('Test bulk endpoint error:', error);
    return res.status(500).json({ 
      error: 'Test endpoint error',
      message: error.message 
    });
  }
}
