import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Send, Bot, User, Loader2, Sparkles, ArrowLeft, Minimize2, Maximize2, RotateCcw, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  feedback?: 'positive' | 'negative' | null;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

interface AIChatbotProps {
  onBack: () => void;
  userProfile?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  resumeData?: ResumeData | null;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ onBack, userProfile, resumeData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI Career Assistant. I'm here to help you with job search strategies, career guidance, upskilling recommendations, and planning your professional future. How can I assist you today?",
      timestamp: new Date(),
      feedback: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const genAI = new GoogleGenerativeAI('AIzaSyAj36MF3L_5a0ZysJ-GBKamrOux9m2SHnQ');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const generateUserContext = () => {
    let context = "User Profile Context:\n";
    
    if (userProfile) {
      context += `Name: ${userProfile.name}\n`;
      context += `Location: ${userProfile.location}\n`;
      context += `Bio: ${userProfile.bio}\n`;
    }

    if (resumeData) {
      context += "\nResume Information:\n";
      context += `Professional Summary: ${resumeData.personalInfo.summary}\n`;
      
      if (resumeData.experience.length > 0) {
        context += "\nWork Experience:\n";
        resumeData.experience.forEach((exp, index) => {
          context += `${index + 1}. ${exp.title} at ${exp.company} (${exp.duration})\n`;
          context += `   ${exp.description}\n`;
        });
      }

      if (resumeData.education.length > 0) {
        context += "\nEducation:\n";
        resumeData.education.forEach((edu, index) => {
          context += `${index + 1}. ${edu.degree} from ${edu.school} (${edu.year})\n`;
        });
      }

      if (resumeData.skills.length > 0) {
        context += `\nSkills: ${resumeData.skills.join(', ')}\n`;
      }
    }

    return context;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const userContext = generateUserContext();
      
      const prompt = `
        You are an AI Career Assistant helping users with job search, career guidance, and professional development. 
        
        ${userContext}
        
        Based on the user's profile and resume information above, provide personalized career advice. 
        
        Guidelines:
        - Be helpful, encouraging, and professional
        - Provide specific, actionable advice
        - Consider their current experience level and skills
        - Suggest relevant upskilling opportunities
        - Help with job search strategies
        - Provide career path recommendations
        - Keep responses concise but comprehensive
        - Use a friendly, conversational tone
        
        User Question: ${inputMessage}
        
        Provide a helpful response based on their profile and career goals.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponse = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        feedback: null
      };

      setMessages(prev => [...prev, botMessage]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        feedback: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow new line with Shift+Enter
      return;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "How can I improve my resume?",
    "What skills should I learn for my career?",
    "How do I prepare for job interviews?",
    "What career paths are available to me?",
    "How can I negotiate my salary?",
    "What are the trending jobs in my field?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setShowSuggestions(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI Career Assistant. I'm here to help you with job search strategies, career guidance, upskilling recommendations, and planning your professional future. How can I assist you today?",
      timestamp: new Date(),
      feedback: null
    }]);
    setShowSuggestions(true);
    setInputMessage('');
  };

  return (
    <div className={`max-w-4xl mx-auto p-4 lg:p-6 h-screen flex flex-col transition-all duration-300 ${isMinimized ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">AI Career Assistant</h1>
          <p className="text-sm lg:text-base text-gray-600 px-4">Get personalized career guidance, job search tips, and upskilling recommendations</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-20' : ''}`}>
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 ${isMinimized ? 'hidden' : ''}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 lg:space-x-3 max-w-xs sm:max-w-md lg:max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 lg:px-4 py-2 lg:py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                    {message.type === 'bot' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => provideFeedback(message.id, message.feedback === 'positive' ? null : 'positive')}
                          className={`p-1 transition-colors ${message.feedback === 'positive' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => provideFeedback(message.id, message.feedback === 'negative' ? null : 'negative')}
                          className={`p-1 transition-colors ${message.feedback === 'negative' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 lg:space-x-3 max-w-xs sm:max-w-md lg:max-w-3xl">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-3 lg:px-4 py-2 lg:py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    <span className="text-sm lg:text-base text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {showSuggestions && !isMinimized && (
          <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs lg:text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`p-4 lg:p-6 border-t border-gray-200 ${isMinimized ? 'hidden' : ''}`}>
          <div className="flex space-x-2 lg:space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your career, job search, or skills development..."
                className="w-full p-2 lg:p-3 pr-10 lg:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm lg:text-base transition-all"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1 lg:right-2 top-1 lg:top-2 p-1.5 lg:p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 lg:mt-2">
            Press Enter to send, Shift+Enter for new line • 
            <button 
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-blue-600 hover:text-blue-700 ml-1"
            >
              {showSuggestions ? 'Hide' : 'Show'} suggestions
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;