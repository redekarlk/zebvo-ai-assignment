import asyncHandler from '../utils/asyncHandler.js';
import vertexAI from '../config/gemini.js';

export const chatWithAI = asyncHandler(async (req, res) => {
  const { messages, businessInfo } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: 'Messages array is required' });
  }

  const systemPrompt = `You are a professional website designer and strategist for "BuilderAI". 
  You are helping a client refine their website requirements before generation.
  
  Business Details:
  - Name: ${businessInfo?.businessName || 'Unknown'}
  - Category: ${businessInfo?.category || 'General'}
  - Target Audience: ${businessInfo?.targetAudience || 'General'}
  - Tone: ${businessInfo?.tone || 'Professional'}
  
  Your goal is to be helpful, concise, and professional. Ask clarifying questions if needed about their vision, color preferences, or specific sections they want.
  When they are ready to generate the website, tell them to click the "Generate Website" button.
  
  Keep responses short and focused on design/content strategy.`;

  try {
    const model = vertexAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });
    
    // Transform messages to Gemini format (excluding the system prompt which is now handled above)
    // IMPORTANT: Gemini history MUST start with a 'user' message.
    let history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.content) }]
    }));

    // Find the first 'user' message index
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    
    // If there are model messages before the first user message, remove them
    if (firstUserIndex > 0) {
      history = history.slice(firstUserIndex);
    } else if (firstUserIndex === -1 && history.length > 0) {
      // If no user messages in history at all, clear it (the last message will be the user message anyway)
      history = [];
    }

    const chat = model.startChat({
      history: history
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(String(lastMessage));
    const response = result.response.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      message: response
    });
  } catch (error) {
    console.error('[AI Chat] Detailed Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get AI response',
      error: error.message 
    });
  }
});
