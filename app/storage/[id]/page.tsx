'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { StorageSidebar } from "@/components/storage-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useStorageStore } from "@/lib/stores/storage-store";
import { UploadDropdown } from "@/components/upload-dropdown";
import { useSelectedFileStore } from "@/lib/stores/selected-file-store";
import { Download, FileQuestion, FileSearch, LoaderCircle, Trash2, X } from "lucide-react";
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
    const setFiles = useStorageStore((state) => state.setFiles);
    const selectedFile = useSelectedFileStore((state) => state.selectedFile);
    const setSelectedFile = useSelectedFileStore((state) => state.setSelectedFile);
    const clearSelectedFile = useSelectedFileStore((state) => state.clearSelectedFile);

    const [previewMode, setPreviewMode] = React.useState<PreviewMode>("empty");
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [textPreview, setTextPreview] = React.useState<string>("");
    const [previewError, setPreviewError] = React.useState<string>("");
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const previewObjectUrlRef = React.useRef<string | null>(null);
    const previewRequestIdRef = React.useRef(0);

    const revokePreviewObjectUrl = React.useCallback(() => {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
            previewObjectUrlRef.current = null;
        }
    }, []);

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
            revokePreviewObjectUrl();
            clearSelectedFile();
        };
    }, [clearSelectedFile, revokePreviewObjectUrl]);

    React.useEffect(() => {
        if (!selectedFile) {
            revokePreviewObjectUrl();
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
        const requestId = ++previewRequestIdRef.current;
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
                if (requestId !== previewRequestIdRef.current) {
                    return;
                }
                const contentType = blob.type || selectedFile.type || "";
                const extension = selectedFile.extension;

                if (contentType.startsWith("image/")) {
                    revokePreviewObjectUrl();
                    const objectUrl = URL.createObjectURL(blob);
                    if (requestId !== previewRequestIdRef.current) {
                        URL.revokeObjectURL(objectUrl);
                        return;
                    }
                    previewObjectUrlRef.current = objectUrl;
                    setPreviewUrl(objectUrl);
                    setPreviewMode("image");
                    return;
                }

                if (contentType === "application/pdf" || extension === "pdf") {
                    revokePreviewObjectUrl();
                    const objectUrl = URL.createObjectURL(blob);
                    if (requestId !== previewRequestIdRef.current) {
                        URL.revokeObjectURL(objectUrl);
                        return;
                    }
                    previewObjectUrlRef.current = objectUrl;
                    setPreviewUrl(objectUrl);
                    setPreviewMode("pdf");
                    return;
                }

                if (contentType.startsWith("video/")) {
                    revokePreviewObjectUrl();
                    const objectUrl = URL.createObjectURL(blob);
                    if (requestId !== previewRequestIdRef.current) {
                        URL.revokeObjectURL(objectUrl);
                        return;
                    }
                    previewObjectUrlRef.current = objectUrl;
                    setPreviewUrl(objectUrl);
                    setPreviewMode("video");
                    return;
                }

                if (contentType.startsWith("audio/")) {
                    revokePreviewObjectUrl();
                    const objectUrl = URL.createObjectURL(blob);
                    if (requestId !== previewRequestIdRef.current) {
                        URL.revokeObjectURL(objectUrl);
                        return;
                    }
                    previewObjectUrlRef.current = objectUrl;
                    setPreviewUrl(objectUrl);
                    setPreviewMode("audio");
                    return;
                }

                if (contentType.startsWith("text/") || TEXT_EXTENSIONS.has(extension)) {
                    revokePreviewObjectUrl();
                    const text = await blob.text();
                    if (requestId !== previewRequestIdRef.current) {
                        return;
                    }
                    setPreviewUrl(null);
                    setTextPreview(text);
                    setPreviewMode("text");
                    return;
                }

                revokePreviewObjectUrl();
                setPreviewUrl(null);
                setPreviewMode("unsupported");
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
                if (requestId !== previewRequestIdRef.current) {
                    return;
                }
                revokePreviewObjectUrl();
                setPreviewUrl(null);
                setPreviewMode("error");
                setPreviewError(error instanceof Error ? error.message : "Preview error");
            }
        };

        void loadPreview();

        return () => {
            controller.abort();
            revokePreviewObjectUrl();
        };
    }, [revokePreviewObjectUrl, selectedFile, selectedStorage]);

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

    const handleDownloadFile = React.useCallback(async () => {
        if (!selectedFile?.path || !selectedStorage || isDownloading) {
            return;
        }

        setIsDownloading(true);
        try {
            const encodedPath = selectedFile.path
                .split("/")
                .filter(Boolean)
                .map((segment) => encodeURIComponent(segment))
                .join("/");

            const response = await fetch(`/api/minio/download/${encodedPath}`, {
                headers: {
                    "x-storage-name": selectedStorage.name,
                },
            });

            if (!response.ok) {
                throw new Error("Could not download file");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = selectedFile.name;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading, selectedFile, selectedStorage]);

    const handleDeleteFile = React.useCallback(async () => {
        if (!selectedFile?.path || !selectedStorage || isDeleting) {
            return;
        }

        setIsDeleting(true);
        try {
            const encodedPath = encodeURIComponent(selectedFile.path);
            const query = new URLSearchParams({ name: selectedStorage.name });
            const response = await fetch(`/api/minio/delete/${encodedPath}?${query.toString()}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Could not delete file");
            }

            setFiles(files.filter((file) => file.name !== selectedFile.path));
            clearSelectedFile();
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsDeleting(false);
        }
    }, [clearSelectedFile, files, isDeleting, selectedFile, selectedStorage, setFiles]);

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

          <main className="flex-1 p-4 sm:p-6 lg:p-10">
              <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row">
                  <div className="flex min-w-0 flex-col gap-2">
                    <h1 className="truncate text-lg font-bold sm:text-2xl">{selectedFile?.path ?? ""}</h1>
                    {selectedFile ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDownloadFile}
                          disabled={isDownloading}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleDeleteFile}
                          disabled={isDeleting}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearSelectedFile}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Close file
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex w-full items-center justify-start gap-2 md:w-auto md:justify-end">
                      <UploadDropdown bucketName={selectedStorage.name} onUploaded={addFiles} />
                  </div>
              </div>
              <section className="bg-muted/20 min-h-[320px] rounded-xl border p-3 sm:min-h-[420px] sm:p-4">
                {previewMode === "empty" ? (
                  <div className="text-muted-foreground flex h-[260px] flex-col items-center justify-center gap-2 sm:h-[380px]">
                    <FileSearch className="h-8 w-8" />
                    <p className="text-sm">Select a file in the left panel to preview it.</p>
                  </div>
                ) : null}

                {previewMode === "loading" ? (
                  <div className="text-muted-foreground flex h-[260px] items-center justify-center gap-2 sm:h-[380px]">
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
                  <div className="flex h-[260px] items-center justify-center sm:h-[380px]">
                    <audio src={previewUrl} controls className="w-full max-w-lg" />
                  </div>
                ) : null}

                {previewMode === "unsupported" ? (
                  <div className="text-muted-foreground flex h-[260px] flex-col items-center justify-center gap-2 sm:h-[380px]">
                    <FileQuestion className="h-8 w-8" />
                    <p className="text-sm">Preview is not available for this file type.</p>
                  </div>
                ) : null}

                {previewMode === "error" ? (
                  <div className="text-muted-foreground flex h-[260px] flex-col items-center justify-center gap-2 sm:h-[380px]">
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
