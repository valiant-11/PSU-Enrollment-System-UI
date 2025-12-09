import { useState } from "react";
import { Upload, X, FileCheck } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploadProps {
  label: string;
  onFileChange?: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ label, onFileChange, accept = ".pdf,.jpg,.jpeg,.png" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileChange?.(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileChange?.(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange?.(null);
  };

  return (
    <div className="space-y-2">
      <label className="block">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : file
            ? "border-primary/50 bg-card"
            : "border-border bg-card hover:border-primary/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop or click to upload
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
