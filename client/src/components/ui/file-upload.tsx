import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, FileText, Image, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.zip",
  multiple = true,
  className,
  disabled = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`;
    }

    // Check file type
    const allowedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return `File type "${fileExtension}" is not allowed.`;
    }

    return null;
  }, [maxSize, accept]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    // Validate each file
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        continue;
      }

      // Check if we're exceeding the max files limit
      if (selectedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
        break;
      }

      validFiles.push(file as FileWithPreview);
    }

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "File Upload Error",
        description: errors.join(' '),
        variant: "destructive",
      });
    }

    // Add valid files to selection
    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        setSelectedFiles(validFiles.slice(0, 1));
      }
    }
  }, [validateFile, maxFiles, selectedFiles.length, multiple, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [disabled, handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      toast({
        title: "Upload Successful",
        description: `${selectedFiles.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles, onUpload, toast]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drag & Drop Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        data-testid="file-upload-dropzone"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-muted-foreground">
          Max {maxFiles} files, {Math.round(maxSize / (1024 * 1024))}MB each
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          data-testid="file-upload-input"
        />
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
                data-testid={`selected-file-${index}`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  data-testid={`remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
            data-testid="button-upload-files"
          >
            {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
          </Button>
        </div>
      )}

      {/* File Type Information */}
      <div className="text-xs text-muted-foreground">
        <p className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Supported formats: PDF, Word, Excel, Images, Text files, ZIP</span>
        </p>
      </div>
    </div>
  );
}