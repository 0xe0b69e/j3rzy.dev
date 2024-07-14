"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import FileIcon from "@/components/files/FileIcon";
import { Cross1Icon, DownloadIcon, GridIcon, HamburgerMenuIcon, TrashIcon } from "@radix-ui/react-icons";

export default function Files (): JSX.Element
{
  const [ useGrid, setUseGrid ] = useState<boolean>(false);
  const [ selectedFiles, setSelectedFiles ] = useState<string[]>([]);
  
  const popularFileExtensions = [
    "html", "css", "js", "jsx", "ts", "tsx", "json", "java", "py", "cpp", "c", "cs", "php", "rb", "swift", "go", "rs", "kt", "lua",
    "sh", "bat", "yaml", "yml", "xml", "sql", "md", "csv", "txt", "png", "jpg", "jpeg", "gif", "svg", "bmp", "mp3", "wav", "mp4",
    "avi", "mov", "flv", "mkv", "webm", "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "7z", "tar", "gz", "bz2",
    "exe", "iso", "img", "apk", "jar", "dll", "so", "properties", "gradle", "raw", "bin", "class", "war", "ear", "deb", "rpm", "dmg",
    "app", "pkg", "ipa", "msi", "cab", "torrent", "key", "pem", "crt", "cer", "csr", "pfx", "jks", "keystore", "truststore", "pub",
  ];
  
  const files = popularFileExtensions.map((ext, index) => ({
    id: `gdkj${index}fhgdkjfh`,
    name: `file-${index + 1}.${ext}`,
    size: index * 1000,
    uploader: "John Doe",
    date: "2022-01-01"
  }));
  
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="w-full flex justify-between px-4 space-x-5">
        <div
          className={cn(
            "w-full rounded-full bg-surface dark:bg-surface-dark p-1 transition-all duration-150 flex flex-row items-center space-x-1",
            selectedFiles.length <= 0 && "opacity-0 pointer-events-none"
          )}
        >
          <button
            className={cn(
              "inline-flex items-center justify-center p-2 rounded-full",
              "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
            )}
            title="Clear selection"
            onClick={() => setSelectedFiles([])}
          >
            <Cross1Icon/>
          </button>
          <p>{selectedFiles.length} selected</p>
          <button
            className={cn(
              "inline-flex items-center justify-center p-2 rounded-full",
              "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
            )}
            title="Download selected"
            onClick={() =>
            {
              // TODO: Download selected files
            }}
          >
            <DownloadIcon/>
          </button>
          <button
            className={cn(
              "inline-flex items-center justify-center p-2 rounded-full group",
              "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
            )}
            title={`Delete ${selectedFiles.length} selected`}
            onClick={() =>
            {
              // TODO: Delete selected files
            }}
            disabled
          >
            <TrashIcon className="group-disabled:text-black/50 group-disabled:dark:text-white/50" />
          </button>
        </div>
        <div className="h-10 w-28">
          <button
            className={cn(
              "w-1/2 h-full rounded-l-full border-[1px] inline-flex items-center justify-center transition-colors duration-150",
              useGrid ? "bg-surface dark:bg-surface-dark border-surface dark:border-surface-dark" : "bg-secondary/25 border-secondary/50 hover:bg-secondary/35"
            )}
            onClick={() => setUseGrid(false)}
            title="List layout"
          >
            <HamburgerMenuIcon/>
          </button>
          <button
            className={cn(
              "w-1/2 h-full rounded-r-full border-[1px] inline-flex items-center justify-center transition-colors duration-150",
              useGrid ? "bg-secondary/25 border-secondary/50 hover:bg-secondary/35" : "bg-surface dark:bg-surface-dark border-surface dark:border-surface-dark"
            )}
            onClick={() => setUseGrid(true)}
            title="Grid layout"
          >
            <GridIcon/>
          </button>
        </div>
      </div>
      <div
        className="grid max-h-[calc(100vh-136px)] overflow-y-auto p-1 gap-2"
        style={useGrid ? ({ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }) : ({})}
      >
        {files.map((file, index) => (
          <div
            key={index}
            className={cn(
              "grid rounded-lg p-2 shadow bg-gradient-to-b select-none transition-colors duration-150 cursor-pointer",
              useGrid ? "items-center justify-center text-center grid-cols-1" : "text-left grid-cols-5",
              selectedFiles.includes(file.id)
                ? "dark:from-secondary dark:to-primary from-secondary/40 to-primary/65"
                : "from-surface/75 dark:from-surface-dark/75 to-surface/40 dark:to-surface-dark/40"
            )}
            onClick={event =>
            {
              event.preventDefault();
              const isSelected: boolean = selectedFiles.includes(file.id);
              const unSelect = () => setSelectedFiles(selectedFiles.filter(f => f !== file.id));
              const select = () => setSelectedFiles([ ...selectedFiles, file.id ]);
              if ( event.ctrlKey )
              {
                if ( isSelected )
                {
                  unSelect();
                } else
                {
                  select();
                }
              } else if ( event.shiftKey )
              {
                const lastSelected: string = selectedFiles[selectedFiles.length - 1];
                const lastIndex: number = files.findIndex(f => f.id === lastSelected);
                const currentIndex: number = files.findIndex(f => f.id === file.id);
                const range: number[] = [ lastIndex, currentIndex ].sort((a, b) => a - b);
                setSelectedFiles(files.slice(range[0], range[1] + 1).map(f => f.id));
              } else
              {
                setSelectedFiles(isSelected ? [] : [ file.id ]);
              }
            }}
          >
            <div
              className={useGrid ? "w-full flex justify-center" : ""}
            >
              <FileIcon
                fileName={file.name}
                className={cn(
                  useGrid && "w-32 h-32"
                )}
              />
            </div>
            <p className={cn(useGrid && "text-xl", "font-mono")}>{file.name}</p>
            <p>{file.size}</p>
            <p>{file.uploader}</p>
            <p>{file.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}