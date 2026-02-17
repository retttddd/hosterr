"use client";

import * as React from "react";
import { ChevronRight, FileText, Folder, FolderTree, HardDrive } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type StorageFile = {
  name: string;
  size: number;
  lastModified: Date | string;
};

type StorageSidebarProps = {
  storageName: string;
  files: StorageFile[];
  selectedFilePath?: string;
  onFileSelect?: (filePath: string) => void;
};

type MutableFolderNode = {
  name: string;
  path: string;
  children: Map<string, MutableFolderNode>;
  files: string[];
};

type FolderNode = {
  name: string;
  path: string;
  children: FolderNode[];
  files: string[];
};

function createMutableFolderNode(name: string, path: string): MutableFolderNode {
  return {
    name,
    path,
    children: new Map<string, MutableFolderNode>(),
    files: [],
  };
}

function convertFolderNode(node: MutableFolderNode): FolderNode {
  const children = Array.from(node.children.values())
    .map(convertFolderNode)
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedFiles = [...node.files].sort((a, b) => a.localeCompare(b));

  return {
    name: node.name,
    path: node.path,
    children,
    files: sortedFiles,
  };
}

function buildFolderTree(files: StorageFile[]): FolderNode {
  const root = createMutableFolderNode("", "");

  for (const file of files) {
    const normalizedPath = file.name.replace(/^\/+|\/+$/g, "");
    if (!normalizedPath) continue;

    const parts = normalizedPath.split("/").filter(Boolean);

    if (parts.length === 1) {
      root.files.push(normalizedPath);
      continue;
    }

    let currentNode = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const segment = parts[index];
      const nextPath = currentNode.path ? `${currentNode.path}/${segment}` : segment;

      if (!currentNode.children.has(segment)) {
        currentNode.children.set(segment, createMutableFolderNode(segment, nextPath));
      }

      const childNode = currentNode.children.get(segment);
      if (!childNode) break;
      currentNode = childNode;
    }

    currentNode.files.push(normalizedPath);
  }

  return convertFolderNode(root);
}

function getDisplayName(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

export function StorageSidebar({ storageName, files, selectedFilePath, onFileSelect }: StorageSidebarProps) {
  const { collapsed } = useSidebar();
  const tree = React.useMemo(() => buildFolderTree(files), [files]);
  const [openDirectories, setOpenDirectories] = React.useState<Record<string, boolean>>({});

  const handleFileSelect = React.useCallback((filePath: string) => {
    onFileSelect?.(filePath);
  }, [onFileSelect]);

  const mockOpenDirectory = React.useCallback((directoryPath: string) => {
    console.info(`[MOCK] open directory: ${directoryPath}`);
  }, []);

  const toggleDirectory = React.useCallback(
    (directoryPath: string) => {
      setOpenDirectories((previous) => ({
        ...previous,
        [directoryPath]: !previous[directoryPath],
      }));

      mockOpenDirectory(directoryPath);
    },
    [mockOpenDirectory]
  );

  const renderDirectory = (directory: FolderNode, depth = 0): React.ReactNode => {
    const isOpen = Boolean(openDirectories[directory.path]);

    return (
      <li key={directory.path} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleDirectory(directory.path)}
          className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          title={directory.path}
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          <Folder className="h-3.5 w-3.5" />
          <span className="truncate">{directory.name}</span>
        </button>

        {isOpen ? (
          <div className="space-y-1">
            {directory.children.length > 0 ? (
              <ul className="space-y-1">{directory.children.map((child) => renderDirectory(child, depth + 1))}</ul>
            ) : null}

            {directory.files.length > 0 ? (
              <ul className="space-y-1">
                {directory.files.map((filePath) => (
                  <li key={filePath}>
                    <button
                      type="button"
                      onClick={() => handleFileSelect(filePath)}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        selectedFilePath === filePath ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }`}
                      style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
                      title={filePath}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="truncate">{getDisplayName(filePath)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </li>
    );
  };

  const renderFile = (filePath: string, depth = 0): React.ReactNode => (
    <li key={filePath}>
      <button
        type="button"
        onClick={() => handleFileSelect(filePath)}
        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
          selectedFilePath === filePath ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        title={filePath}
      >
        <FileText className="h-3.5 w-3.5" />
        <span className="truncate">{getDisplayName(filePath)}</span>
      </button>
    </li>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <HardDrive className="h-4 w-4 text-primary" />
            <span className="truncate">{storageName}</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {collapsed ? (
          <SidebarGroup className="p-2">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => mockOpenDirectory("folders")}
                className="rounded p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                title={`Folders (${tree.children.length})`}
              >
                <FolderTree className="h-4 w-4" />
              </button>
            </div>
          </SidebarGroup>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <FolderTree className="h-3.5 w-3.5" />
                Folder Structure
              </SidebarGroupLabel>

              {tree.children.length === 0 && tree.files.length === 0 ? (
                <p className="text-sm text-muted-foreground">No folders found</p>
              ) : (
                <ul className="space-y-1">
                  {tree.children.map((directory) => renderDirectory(directory))}
                  {tree.files.map((filePath) => renderFile(filePath))}
                </ul>
              )}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
