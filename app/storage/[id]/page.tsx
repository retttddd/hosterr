'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Header } from "@/components/header";
import { StorageSidebar } from "@/components/storage-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type FileInfo = {
    name: string;
    size: number;
    lastModified: Date;
};

export default function Storage() {
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [storageName, setStorageName] = React.useState<string>('');
    const [files, setFiles] = React.useState<FileInfo[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchStorageAndFiles = React.useCallback(async () => {
      if (!id) return;

      try {
            setLoading(true);
            setError(null);
            const storageResponse = await fetch(`/api/storages/${id}`);
            if (!storageResponse.ok) {
                throw new Error('Storage not found');
            }
            const storageData = await storageResponse.json();
            const storage = storageData.storage;
            setStorageName(storage.name);

            const query = new URLSearchParams({ name: storage.name });
            const filesResponse = await fetch(`/api/minio/files?${query.toString()}`);
            if (!filesResponse.ok) {
                throw new Error('Could not load storage files');
            }
            const filesData = await filesResponse.json();

            if (filesData.files) {
                setFiles(filesData.files);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchStorageAndFiles();
    }, [fetchStorageAndFiles]);

    if (loading) return <div className="p-10">Loading...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;

    return (
      <>
      <Header />

      <SidebarProvider>
          <StorageSidebar storageName={storageName} files={files} />

          <main className="flex-1 p-10">
              <h1 className="mb-6 text-2xl font-bold">{storageName}</h1>
              <ul className="space-y-2">
                  {files.length === 0 ? (
                      <li className="text-gray-500">No files found</li>
                  ) : (
                      files.map((file) => (
                          <li
                              key={file.name}
                              className="flex items-center justify-between rounded bg-gray-50 p-3 hover:bg-gray-100"
                          >
                              <span>{file.name}</span>
                              <span className="text-sm text-muted-foreground">
                                  {Math.max(1, Math.round(file.size / 1024))} KB
                              </span>
                          </li>
                      ))
                  )}
              </ul>
          </main>
      </SidebarProvider>
      </>
    );
}
