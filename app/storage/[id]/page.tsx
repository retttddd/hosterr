'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { StorageSidebar } from "@/components/storage-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useStorageStore } from "@/lib/stores/storage-store";

export default function Storage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const selectedStorage = useStorageStore((state) => state.selectedStorage);
    const files = useStorageStore((state) => state.files);

    React.useEffect(() => {
        if (!id) {
            return;
        }
        if (!selectedStorage || String(selectedStorage.id) !== id) {
            router.replace("/storage");
            return;
        }
    }, [id, router, selectedStorage]);

    if (!id || !selectedStorage || String(selectedStorage.id) !== id) {
        return null;
    }

    return (
      <>
      <Header showExitButton />

      <SidebarProvider>
          <StorageSidebar storageName={selectedStorage?.name ?? ""} files={files} />

          <main className="flex-1 p-10">
              <h1 className="mb-6 text-2xl font-bold">{selectedStorage?.name}</h1>
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
