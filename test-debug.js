const https = require('https');

const baseUrl = 'https://juntereu--junter-uitzendbureau.europe-west4.hosted.app';

async function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${path}`;
    console.log(`\n🔍 Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log('📋 Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('📋 Response (raw):', data);
        }
        resolve({ status: res.statusCode, data });
      });
    }).on('error', (err) => {
      console.log(`❌ Error: ${err.message}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🚀 Testing Firebase App Hosting Debug Endpoints\n');
  
  try {
    // Test debug endpoint
    await testEndpoint('/api/debug');
    
    // Test health endpoint
    await testEndpoint('/api/health');
    
    // Test main page
    await testEndpoint('/en');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
