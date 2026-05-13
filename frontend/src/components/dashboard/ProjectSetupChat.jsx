import React, { useState, useRef, useEffect } from 'react';
import aiService from '@/services/ai.service';

const ProjectSetupChat = ({ projectId, businessInfo, onGenerate }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi there! I've created your project for **${businessInfo.businessName}**. 
      
Before I generate the website, would you like to provide any more details? For example, you can tell me about:
- Preferred color schemes or style (e.g., "minimalist blue", "vibrant and bold")
- Specific sections you definitely want to include
- Any specific features or focus areas for the content`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chat([...messages, userMessage], businessInfo);
      const botMessage = response.data?.message || response.data || "I've received your instructions! Feel free to add more or click Generate Website when you're ready.";
      setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMsg = error.response?.data?.message || "I'm having trouble with the live chat right now, but I've noted your instructions. You can still click 'Generate Website' below to continue!";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    // Collect all user messages as instructions
    const userInstructions = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n');
    
    onGenerate(userInstructions);
  };

  return (
    <div className="bg-[#111111] border border-[#222] rounded-sm flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between bg-[#111111] z-10">
        <div>
          <h2 className="text-[15px] font-bold text-white">Refine your vision</h2>
          <p className="text-[11px] text-[#888] font-medium">Chat with BuilderAI to customize your website before generation</p>
        </div>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-[#0099FF] hover:bg-[#0088EE] text-white text-[12px] font-bold rounded-sm transition-colors shadow-lg shadow-[#0099FF]/10"
        >
          Generate Website
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#0A0A0A]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-sm px-4 py-3 text-[13px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#0099FF] text-white font-medium' 
                : 'bg-[#1A1A1A] text-[#DDD] border border-[#222]'
            }`}>
              {msg.content.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border border-[#222] rounded-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#444] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[#111111] border-t border-[#222]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe how you want your website to look..."
            className="w-full bg-[#1A1A1A] border border-[#222] rounded-sm px-4 py-3 pr-12 text-[13px] text-white focus:outline-none focus:border-[#444] transition-colors placeholder-[#555]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#888] hover:text-white transition-colors disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSetupChat;
