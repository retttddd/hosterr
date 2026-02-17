'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { StorageSidebar } from "@/components/storage-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useStorageStore } from "@/lib/stores/storage-store";
import { UploadDropdown } from "@/components/upload-dropdown";
import { useSelectedFileStore } from "@/lib/stores/selected-file-store";
import { FileQuestion, FileSearch, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PreviewMode = "empty" | "loading" | "image" | "pdf" | "text" | "video" | "audio" | "unsupported" | "error";

const TEXT_EXTENSIONS = new Set(["txt", "json", "md", "log", "csv", "xml", "yml", "yaml"]);

function getExtension(fileName: string): string {
    const parts = fileName.split(".");
    if (parts.length < 2) return "";
    return parts[parts.length - 1].toLowerCase();
}

export default function Storage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const selectedStorage = useStorageStore((state) => state.selectedStorage);
    const files = useStorageStore((state) => state.files);
    const addFiles = useStorageStore((state) => state.addFiles);
    const selectedFile = useSelectedFileStore((state) => state.selectedFile);
    const setSelectedFile = useSelectedFileStore((state) => state.setSelectedFile);
    const clearSelectedFile = useSelectedFileStore((state) => state.clearSelectedFile);

    const [previewMode, setPreviewMode] = React.useState<PreviewMode>("empty");
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [textPreview, setTextPreview] = React.useState<string>("");
    const [previewError, setPreviewError] = React.useState<string>("");

    React.useEffect(() => {
        if (!id) {
            return;
        }
        if (!selectedStorage || String(selectedStorage.id) !== id) {
            clearSelectedFile();
            router.replace("/storage");
            return;
        }
    }, [clearSelectedFile, id, router, selectedStorage]);

    React.useEffect(() => {
        return () => {
            clearSelectedFile();
        };
    }, [clearSelectedFile]);

    React.useEffect(() => {
        if (!selectedFile) {
            setPreviewMode("empty");
            setPreviewUrl(null);
            setTextPreview("");
            setPreviewError("");
            return;
        }

        if (!selectedStorage) {
            return;
        }

        const controller = new AbortController();
        let objectUrl: string | null = null;
        setPreviewMode("loading");
        setPreviewUrl(null);
        setTextPreview("");
        setPreviewError("");

        const loadPreview = async () => {
            try {
                if (!selectedFile.path) {
                    setPreviewMode("empty");
                    return;
                }
                const encodedPath = selectedFile.path
                    .split("/")
                    .filter(Boolean)
                    .map((segment) => encodeURIComponent(segment))
                    .join("/");
                const response = await fetch(`/api/minio/download/${encodedPath}`, {
                    signal: controller.signal,
                    headers: {
                        "x-storage-name": selectedStorage.name,
                    },
                });

                if (!response.ok) {
                    throw new Error("Could not load preview");
                }

                const blob = await response.blob();
                const contentType = blob.type || selectedFile.type || "";
                const extension = selectedFile.extension;

                if (contentType.startsWith("image/")) {
                    objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                    setPreviewMode("image");
                    return;
                }

                if (contentType === "application/pdf" || extension === "pdf") {
                    objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                    setPreviewMode("pdf");
                    return;
                }

                if (contentType.startsWith("video/")) {
                    objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                    setPreviewMode("video");
                    return;
                }

                if (contentType.startsWith("audio/")) {
                    objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                    setPreviewMode("audio");
                    return;
                }

                if (contentType.startsWith("text/") || TEXT_EXTENSIONS.has(extension)) {
                    const text = await blob.text();
                    setTextPreview(text);
                    setPreviewMode("text");
                    return;
                }

                setPreviewMode("unsupported");
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
                setPreviewMode("error");
                setPreviewError(error instanceof Error ? error.message : "Preview error");
            }
        };

        void loadPreview();

        return () => {
            controller.abort();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [selectedFile, selectedStorage]);

    const handleFileSelect = React.useCallback((filePath: string) => {
        const file = files.find((entry) => entry.name === filePath);
        if (!file) {
            return;
        }
        const extension = getExtension(file.name);
        setSelectedFile({
            id: `${file.name}-${file.lastModified}`,
            name: file.name.split("/").filter(Boolean).pop() ?? file.name,
            path: file.name,
            size: file.size,
            lastModified: file.lastModified,
            extension,
        });
    }, [files, setSelectedFile]);

    if (!id || !selectedStorage || String(selectedStorage.id) !== id) {
        return null;
    }

    return (
      <>
      <Header showExitButton />

      <SidebarProvider>
          <StorageSidebar
            storageName={selectedStorage?.name ?? ""}
            files={files}
            onFileSelect={handleFileSelect}
            selectedFilePath={selectedFile?.path}
          />

          <main className="flex-1 p-10">
              <div className="mb-6 flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-bold">{selectedFile?.path ?? ""}</h1>
                  <div className="flex items-center gap-2">
                      {selectedFile ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearSelectedFile}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Close file
                        </Button>
                      ) : null}
                      <UploadDropdown bucketName={selectedStorage.name} onUploaded={addFiles} />
                  </div>
              </div>
              <section className="bg-muted/20 min-h-[420px] rounded-xl border p-4">
                {previewMode === "empty" ? (
                  <div className="text-muted-foreground flex h-[380px] flex-col items-center justify-center gap-2">
                    <FileSearch className="h-8 w-8" />
                    <p className="text-sm">Select a file in the left panel to preview it.</p>
                  </div>
                ) : null}

                {previewMode === "loading" ? (
                  <div className="text-muted-foreground flex h-[380px] items-center justify-center gap-2">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    <p className="text-sm">Loading preview...</p>
                  </div>
                ) : null}

                {previewMode === "image" && previewUrl ? (
                  <img src={previewUrl} alt={selectedFile?.name ?? "Preview"} className="max-h-[75vh] w-full rounded object-contain" />
                ) : null}

                {previewMode === "pdf" && previewUrl ? (
                  <iframe src={previewUrl} title={selectedFile?.name ?? "PDF Preview"} className="h-[75vh] w-full rounded border" />
                ) : null}

                {previewMode === "text" ? (
                  <pre className="bg-background max-h-[75vh] overflow-auto rounded border p-4 text-sm whitespace-pre-wrap">
                    {textPreview}
                  </pre>
                ) : null}

                {previewMode === "video" && previewUrl ? (
                  <video src={previewUrl} controls className="max-h-[75vh] w-full rounded" />
                ) : null}

                {previewMode === "audio" && previewUrl ? (
                  <div className="flex h-[380px] items-center justify-center">
                    <audio src={previewUrl} controls className="w-full max-w-lg" />
                  </div>
                ) : null}

                {previewMode === "unsupported" ? (
                  <div className="text-muted-foreground flex h-[380px] flex-col items-center justify-center gap-2">
                    <FileQuestion className="h-8 w-8" />
                    <p className="text-sm">Preview is not available for this file type.</p>
                  </div>
                ) : null}

                {previewMode === "error" ? (
                  <div className="text-muted-foreground flex h-[380px] flex-col items-center justify-center gap-2">
                    <FileQuestion className="h-8 w-8" />
                    <p className="text-sm">Could not open file preview.</p>
                    <p className="text-xs">{previewError}</p>
                  </div>
                ) : null}
              </section>
          </main>
      </SidebarProvider>
      </>
    );
}
