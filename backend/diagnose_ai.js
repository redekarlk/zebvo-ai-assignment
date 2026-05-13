import genAI from './src/config/gemini.js';

async function testModernSDK() {
  try {
    console.log('Testing modern @google/genai SDK with Vertex AI...');
    
    // In the new SDK, generateContent returns a response directly
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Say "SDK Working" if authenticated.' }] }]
    });
    
    // The response structure might have changed slightly
    console.log('Full Response:', JSON.stringify(result, null, 2));
    
    // Try to get text using the helper if it exists, or candidate access
    const text = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Extracted Text:', text);
  } catch (error) {
    console.error('Modern SDK Error:', error);
  }
}

testModernSDK();
