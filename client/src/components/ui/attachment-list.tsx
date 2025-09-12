import { useState } from 'react';
import { Download, Trash2, File, FileText, Image, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export interface FileAttachment {
  id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string | null;
  uploadedAt: string;
  leadId?: string | null;
  estimateId?: string | null;
  jobId?: string | null;
}

interface AttachmentListProps {
  attachments: FileAttachment[];
  isLoading?: boolean;
  onDownload: (attachment: FileAttachment) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
  className?: string;
  emptyMessage?: string;
}

export function AttachmentList({
  attachments,
  isLoading = false,
  onDownload,
  onDelete,
  className,
  emptyMessage = "No files attached yet."
}: AttachmentListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (attachment: FileAttachment) => {
    setDownloadingId(attachment.id);
    try {
      await onDownload(attachment);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);
    try {
      await onDelete(attachmentId);
      toast({
        title: "File Deleted",
        description: "File has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (mimeType === 'application/pdf' || mimeType.includes('word') || mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatUploadDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading attachments...</span>
        </div>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <File className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} data-testid="attachment-list">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Attachments ({attachments.length})</h4>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            data-testid={`attachment-item-${attachment.id}`}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {getFileIcon(attachment.mimeType)}
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" title={attachment.originalName}>
                  {attachment.originalName}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(attachment.fileSize)}</span>
                  <span>•</span>
                  <span>{formatUploadDate(attachment.uploadedAt)}</span>
                  {attachment.uploadedBy && (
                    <>
                      <span>•</span>
                      <span>by {attachment.uploadedBy}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(attachment)}
                disabled={downloadingId === attachment.id || deletingId === attachment.id}
                data-testid={`button-download-${attachment.id}`}
                title="Download file"
              >
                {downloadingId === attachment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={downloadingId === attachment.id || deletingId === attachment.id}
                    data-testid={`button-delete-${attachment.id}`}
                    title="Delete file"
                  >
                    {deletingId === attachment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-destructive" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{attachment.originalName}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(attachment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      data-testid={`confirm-delete-${attachment.id}`}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {/* File Type Legend */}
      <div className="text-xs text-muted-foreground border-t pt-3">
        <div className="flex items-center space-x-1 mb-1">
          <AlertCircle className="w-3 h-3" />
          <span>File Icons:</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Image className="w-3 h-3 text-blue-500" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3 text-red-500" />
            <span>Documents</span>
          </div>
          <div className="flex items-center space-x-1">
            <File className="w-3 h-3 text-gray-500" />
            <span>Other files</span>
          </div>
        </div>
      </div>
    </div>
  );
}