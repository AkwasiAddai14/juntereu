import { OpenAI } from 'openai';
import { connectToDB } from '../../app/lib/mongoose';
import { ChatMessage } from '../../app/lib/models/ChatMessage.model';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req: any, res: any) {
  // Enable CORS for all origins (you might want to restrict this in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { messages } = req.body;
    
    console.log('Received chat request:', { messagesCount: messages?.length });
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from user' });
    }

    // For now, we'll use a default agent (supportBot)
    // You can modify this to accept an agentId in the request if needed
    const agentId = 'supportBot';
    const userId = 'anonymous'; // You might want to get this from authentication
    
    // Save the user message to database
    await ChatMessage.create({
      agentId,
      userId,
      message: lastMessage.content,
      isUser: true
    });

    // Create the completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'Je bent een behulpzame klantenservice-assistent voor Junter. Beantwoord vragen vriendelijk en professioneel in het Nederlands. Help gebruikers met vragen over de app, diensten, en algemene ondersteuning.' 
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantReply = completion.choices[0].message.content || 'Sorry, ik kon geen antwoord genereren.';

    console.log('Generated response:', assistantReply);

    // Save the assistant response to database
    await ChatMessage.create({
      agentId,
      userId,
      message: assistantReply,
      isUser: false
    });

    return res.status(200).json({ 
      reply: assistantReply 
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
