"use client";

import * as React from "react";
import { FolderTree, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StorageFile } from "@/lib/stores/storage-store";

type ClassifyDropdownProps = {
  files: StorageFile[];
};

type ClassifiedFile = {
  name: string;
  location: "root" | "folder";
};

function classifyFiles(files: StorageFile[]): { rootFiles: ClassifiedFile[]; folderFiles: ClassifiedFile[] } {
  const rootFiles: ClassifiedFile[] = [];
  const folderFiles: ClassifiedFile[] = [];

  for (const file of files) {
    const normalizedPath = file.name.trim().replace(/^\/+|\/+$/g, "");
    if (!normalizedPath) continue;

    const isRootFile = !normalizedPath.includes("/");
    const classifiedFile: ClassifiedFile = {
      name: normalizedPath,
      location: isRootFile ? "root" : "folder",
    };

    if (isRootFile) {
      rootFiles.push(classifiedFile);
      continue;
    }

    folderFiles.push(classifiedFile);
  }

  rootFiles.sort((a, b) => a.name.localeCompare(b.name));
  folderFiles.sort((a, b) => a.name.localeCompare(b.name));

  return { rootFiles, folderFiles };
}

export function ClassifyDropdown({ files }: ClassifyDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { rootFiles, } = React.useMemo(() => classifyFiles(files), [files]);


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="flex items-center gap-2">
          <FolderTree className="h-4 w-4" />
          Classify
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] max-w-[24rem] p-3 sm:w-96"
        align="end"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="space-y-3">
          <div className="bg-muted/40 rounded-md px-3 py-2 text-sm">
            <p className="font-medium">Classification summary</p>
            <p className="text-muted-foreground mt-1">
              Total: {files.length} files, Root: {rootFiles.length}
            </p>
          </div>

          <Button type="button" className="w-full" onClick={() =>console.log({ rootFiles })}>
            Go
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
