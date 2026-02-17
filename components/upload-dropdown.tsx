"use client";

import * as React from "react";
import { FileUp, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StorageFile } from "@/lib/stores/storage-store";

type UploadDropdownProps = {
  bucketName: string;
  onUploaded?: (files: StorageFile[]) => void;
};

function toStorageFile(file: File): StorageFile {
  return {
    name: file.name,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  };
}

export function UploadDropdown({ bucketName, onUploaded }: UploadDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [queue, setQueue] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const pushFiles = React.useCallback((incomingFiles: File[]) => {
    setQueue((currentQueue) => [...currentQueue, ...incomingFiles]);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    pushFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length === 0) return;
    pushFiles(files);
  };

  const handleRemove = (index: number) => {
    setQueue((currentQueue) => currentQueue.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleUpload = async () => {
    if (queue.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadError(null);
    const uploaded: StorageFile[] = [];

    try {
      for (const file of queue) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", bucketName);

        const response = await fetch("/api/minio/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        uploaded.push(toStorageFile(file));
      }

      onUploaded?.(uploaded);
      setQueue([]);
      setIsOpen(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error uploading files");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          Upload
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-3" align="end" onCloseAutoFocus={(event) => event.preventDefault()}>
        <div className="space-y-3">
          <div
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            className={cn(
              "border-input rounded-lg border border-dashed p-4 text-center",
              "bg-muted/30"
            )}
          >
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground">or choose files manually</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              Choose files
            </Button>
          </div>

          <div className="max-h-44 space-y-2 overflow-auto">
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files selected</p>
            ) : (
              queue.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                  className="bg-muted/40 flex items-center justify-between rounded-md px-2 py-1.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.max(1, Math.round(file.size / 1024))} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRemove(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {uploadError ? (
            <p className="text-sm text-red-600">{uploadError}</p>
          ) : null}

          <Button
            type="button"
            className="w-full"
            onClick={handleUpload}
            disabled={isUploading || queue.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : `Upload ${queue.length} file(s)`}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

