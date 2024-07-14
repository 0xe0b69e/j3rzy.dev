"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import FileIcon from "@/components/files/FileIcon";

export default function Files (): JSX.Element
{
  const [useGrid, setUseGrid] = useState<boolean>(true);
  
  const popularFileExtensions = [
    "html", "css", "js", "jsx", "ts", "tsx", "json", "java", "py", "cpp", "c", "cs", "php", "rb", "swift", "go", "rs", "kt", "lua",
    "sh", "bat", "yaml", "yml", "xml", "sql", "md", "csv", "txt", "png", "jpg", "jpeg", "gif", "svg", "bmp", "mp3", "wav", "mp4",
    "avi", "mov", "flv", "mkv", "webm", "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "7z", "tar", "gz", "bz2",
    "exe", "iso", "img"
  ];
  
  const files = popularFileExtensions.map((ext, index) => ({
    name: `file-${index + 1}.${ext}`,
    size: "1.2 MB",
    uploader: "John Doe",
    date: "2022-01-01"
  }));
  
  return (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="grid max-h-[calc(100vh-136px)] overflow-y-auto p-1 gap-2"
        style={useGrid ? ({ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }) : ({})}
      >
        {files.map((file, index) => (
          <div
            key={index}
            className={cn(
              "flex text-left rounded-lg p-2 shadow",
              "bg-gradient-to-b from-surface/75 dark:from-surface-dark/75 to-surface/40 dark:to-surface-dark/40",
              useGrid ? "flex-col" : "justify-between"
            )}
          >
            {useGrid && (<FileIcon fileName={file.name} />)}
            <span className="flex-1">{file.name}</span>
            <span className="flex-1">{file.size}</span>
            <span className="flex-1">{file.uploader}</span>
            <span className="flex-1">{file.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}