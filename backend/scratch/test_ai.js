import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    console.log('API Key Length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Respond with a short JSON object like {"status": "ok"}',
    });
    
    const text = response.candidates[0].content.parts[0].text;
    console.log('Raw Text:', text);
    
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleaned);
    console.log('Parsed JSON:', json);
    console.log('Status: SUCCESS');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

test();
