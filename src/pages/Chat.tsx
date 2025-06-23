
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Plus, Brain, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Document Analysis',
      messages: [
        {
          id: '1',
          type: 'user',
          content: 'What are the main points from the uploaded documents?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          type: 'ai',
          content: 'Based on your uploaded documents, here are the main points I can identify...',
          timestamp: new Date(Date.now() - 1000 * 60 * 29)
        }
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 29)
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(chatSessions[0]?.id || '');

  const currentSession = chatSessions.find(session => session.id === currentSessionId);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    // Add user message
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { ...session, messages: [...session.messages, userMessage], lastUpdated: new Date() }
        : session
    ));

    setCurrentMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand your question about "${currentMessage}". Based on the documents in your knowledge base and using ${selectedModel}, here's my response...`,
        timestamp: new Date()
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, aiMessage], lastUpdated: new Date() }
          : session
      ));

      setIsLoading(false);
    }, 2000);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date()
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 w-full justify-start gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <Button onClick={createNewChat} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Chat History</h3>
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  session.id === currentSessionId ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <h4 className="font-medium text-slate-800 truncate">{session.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {session.lastUpdated.toLocaleTimeString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {session.messages.length} messages
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/ace1d83d-6c99-4942-8387-7a42ee1868e6.png" 
                alt="NEC Technologies" 
                className="h-8 w-auto"
              />
              <div className="border-l border-slate-300 h-8"></div>
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-slate-800">Document Chat</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-600">AI Model:</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-2xl rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm p-4">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your documents..."
              className="flex-1 text-base py-3"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              size="lg"
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
