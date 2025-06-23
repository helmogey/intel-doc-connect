
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (fileName: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.txt', '.md'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, TXT, and MD files are supported.",
        variant: "destructive",
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    
    // Simulate upload process
    for (const file of selectedFiles) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFileUpload(file.name);
      
      toast({
        title: "Document added successfully!",
        description: `✅ ${file.name} has been processed and added to your knowledge base.`,
      });
    }
    
    setSelectedFiles([]);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <Upload className={`mx-auto w-12 h-12 mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-slate-500 mb-4">
            Supports PDF, TXT, and MD files
          </p>
          <Button variant="outline" type="button">
            Select Files
          </Button>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{file.name}</span>
                  <span className="text-xs text-slate-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-slate-600 hover:bg-slate-700"
          >
            {uploading ? "Processing..." : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};
