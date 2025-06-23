
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { MessageSquare, Upload, LogOut, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (fileName: string) => {
    setUploadedFiles(prev => [...prev, fileName]);
  };

  const handleChatNavigation = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/ace1d83d-6c99-4942-8387-7a42ee1868e6.png" 
              alt="NEC Technologies" 
              className="h-12 w-auto"
            />
            <div className="border-l border-slate-300 h-12"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Intelligent Document Chat</h1>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to Your AI Document Assistant
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your documents and start intelligent conversations. Choose how you want to interact with your knowledge base.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Chat Card */}
          <Card className="card-hover animate-scale-in bg-white/90 backdrop-blur-sm border-slate-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Start a Conversation</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Engage in a conversation with the AI. It will use the knowledge from your uploaded documents to provide intelligent answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-700 mb-2">Features:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Multiple AI models (Gemini, GPT-4, Claude)</li>
                  <li>• Context-aware responses</li>
                  <li>• Chat history</li>
                  <li>• Real-time streaming</li>
                </ul>
              </div>
              <Button 
                onClick={handleChatNavigation}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg"
                size="lg"
              >
                Go to Chat
              </Button>
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card className="card-hover animate-scale-in bg-white/90 backdrop-blur-sm border-slate-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Manage Knowledge Base</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Add new documents (.pdf, .txt, .md) to create or expand the chatbot's knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload onFileUpload={handleFileUpload} />
              
              {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Recently Added:</h4>
                  <div className="space-y-1">
                    {uploadedFiles.slice(-3).map((fileName, index) => (
                      <div key={index} className="text-sm text-green-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        ✅ {fileName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{uploadedFiles.length}</div>
              <div className="text-slate-600">Documents Uploaded</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
              <div className="text-3xl font-bold text-slate-700 mb-2">3</div>
              <div className="text-slate-600">AI Models Available</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-slate-600">Conversations Possible</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
