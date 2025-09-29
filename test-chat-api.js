// Simple test script for the chat API
const testChatAPI = async () => {
  const testMessages = [
    { role: 'assistant', content: 'Hello! How can I help you today?' },
    { role: 'user', content: 'What is Junter?' }
  ];

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: testMessages
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.reply) {
      console.log('✅ Chat API is working!');
      console.log('Assistant reply:', data.reply);
    } else {
      console.log('❌ No reply received');
    }
  } catch (error) {
    console.error('❌ Error testing chat API:', error.message);
  }
};

// Run the test
testChatAPI();
