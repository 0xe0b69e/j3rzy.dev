"use client";

import { cn, formatBytes, formatDate } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import FileIcon from "@/components/files/FileIcon";
import {
  Cross1Icon,
  DownloadIcon,
  GridIcon,
  HamburgerMenuIcon,
  PlusIcon, Share1Icon,
  TrashIcon, UploadIcon
} from "@radix-ui/react-icons";
import { FileData } from "@/lib/definitions";
import { getFiles } from "@/actions/files";
import Link from "next/link";
import FunnyAnimation from "@/components/FunnyAnimation";
import { useSession } from "next-auth/react";

export default function Files (): JSX.Element
{
  const session = useSession();
  
  const [ useGrid, setUseGrid ] = useState<boolean>(false);
  const [ selectedFileIds, setSelectedFileIds ] = useState<string[]>([]);
  const [ files, setFiles ] = useState<FileData[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isDraggingOver, setIsDraggingOver ] = useState(false);
  
  const [ error, setError ] = useState<string | null>(null);
  const [ success, setSuccess ] = useState<string | null>(null);
  
  useEffect(() =>
  {
    const fetchFiles = async () =>
    {
      const files = await getFiles();
      setFiles(files);
      setIsLoading(false);
    };
    fetchFiles().then();
  }, []);
  
  useEffect(() =>
  {
    setTimeout(() =>
    {
      setError(null);
      setSuccess(null);
    }, 5000);
  }, [ error, success ]);
  
  const selectedFiles: FileData[] = selectedFileIds.map(id => files.find(f => f.id === id)).filter(Boolean) as FileData[];
  const canEditSelectedFiles = !selectedFiles.map(f => f.canEdit).includes(false);
  
  const uploadFiles = async (fileList: FileList) =>
  {
    const formData: FormData = new FormData();
    for ( let i = 0; i < fileList.length; i++ )
    {
      const file: File | null = fileList.item(i);
      if ( !file ) continue;
      formData.append("file", file);
    }
    const res: Response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });
    const json: any = await res.json();
    if ( json.status === 200 && json.files )
    {
      setSuccess("Files uploaded successfully");
      const newFiles = json.files.filter((newFile: FileData) => !files.some((existingFile: FileData) => existingFile.id === newFile.id));
      setFiles([ ...files, ...newFiles ]);
    } else
      setError(json.message);
  };
  const handleCopy = useCallback((text: string) =>
  {
    navigator.clipboard.writeText(text).then(r => console.log("Copied!"));
  }, []);
  
  return (
    <>
      <div
        className={cn(
          "absolute bottom-5 right-0 flex items-center w-48 h-20 rounded-lg rounded-r-none cursor-pointer transition-all duration-300 p-2 z-10 justify-center",
          success && "bg-green-500",
          error && "bg-red-500",
          !success && !error && "translate-x-48 bg-white"
        )}
        onClick={() =>
        {
          setError(null);
          setSuccess(null);
        }}
      >
        <div className="w-full h-full">
          <p className="break-words text-left">{success ?? error}</p>
        </div>
      </div>
      <div
        className="flex flex-col gap-2 p-2 w-full h-full"
        onDragOver={event =>
        {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={event =>
        {
          event.preventDefault();
          setIsDraggingOver(false);
        }}
        onDrop={async event =>
        {
          event.preventDefault();
          setIsDraggingOver(false);
          await uploadFiles(event.dataTransfer.files);
        }}
      >
        <div className={cn(
          isDraggingOver ? "flex" : "hidden",
          "w-full h-full flex-col pointer-events-none fixed items-center justify-center text-center z-40 bg-black/25 top-0 left-0"
        )}>
          <UploadIcon className="w-16 h-16"/>
          <p className="text-lg">Drop to upload</p>
        </div>
        <div
          className="w-full flex xxs:flex-row flex-col xxs:justify-between xxs:px-4 px-1 xxs:space-x-5 max-xxs:space-y-2">
          <div
            className={cn(
              "w-full rounded-full bg-surface dark:bg-surface-dark p-1 transition-all duration-150 flex flex-row items-center space-x-1",
              selectedFileIds.length <= 0 && "opacity-0 pointer-events-none"
            )}
          >
            <button
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-full",
                "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
              )}
              title="Clear selection"
              onClick={() => setSelectedFileIds([])}
            >
              <Cross1Icon/>
            </button>
            <p>{selectedFileIds.length} selected</p>
            <Link
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-full",
                "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
              )}
              title="Download selected"
              href={`/api/file?id=${selectedFileIds.join(",")}`}
              target="_blank"
            >
              <DownloadIcon/>
            </Link>
            <button
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-full group disabled:cursor-not-allowed",
                "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
              )}
              title={canEditSelectedFiles
                ? "Delete selected"
                : `You don't have permission to edit ${selectedFiles.filter(f => !f.canEdit).map(f => f.name).join(", ")}`}
              onClick={async () =>
              {
                if ( !canEditSelectedFiles ) return;
                const path: string = `/api/file?id=${selectedFileIds.join(",")}`;
                const response: Response = await fetch(path, {
                  method: "DELETE",
                });
                const json = await response.json();
                console.log(`DELETE ${path} response: ${json}`);
                if ( json.status === 200 )
                {
                  setSuccess("Selected files deleted successfully");
                  setFiles(files.filter(f => !selectedFileIds.includes(f.id)));
                  setSelectedFileIds([]);
                } else
                {
                  setError(json.message);
                  setSelectedFileIds([]);
                }
              }}
              disabled={!canEditSelectedFiles}
            >
              <TrashIcon className="group-disabled:text-black/25 group-disabled:dark:text-white/25"/>
            </button>
            <button
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-full group disabled:cursor-not-allowed",
                "hover:bg-background/50 hover:dark:bg-background-dark/50 active:bg-background/75 active:dark:bg-background-dark/75 transition-colors duration-150"
              )}
              title={selectedFiles.length === 1 ? "Copy link to file" : "You can only copy link to one file at a time"}
              onClick={() =>
              {
                handleCopy(`https://j3rzy.dev/file/${selectedFiles[0].id}`);
                setSuccess("Link copied to clipboard");
              }}
              disabled={selectedFiles.length > 1}
            >
              <Share1Icon className="group-disabled:text-black/25 group-disabled:dark:text-white/25"/>
            </button>
          </div>
          <div className="inline-flex flex-row space-x-2">
            <div className="h-10 xxs:w-28 w-full">
              <button
                className={cn(
                  "w-1/2 h-full rounded-l-full border-[1px] inline-flex items-center justify-center transition-colors duration-150",
                  useGrid
                    ? "bg-surface/75 dark:bg-surface-dark/75 hover:bg-surface hover:dark:bg-surface-dark border-surface dark:border-surface-dark"
                    : "bg-secondary/25 border-secondary/50 hover:bg-secondary/35"
                )}
                onClick={() => setUseGrid(false)}
                title="List layout"
              >
                <HamburgerMenuIcon/>
              </button>
              <button
                className={cn(
                  "w-1/2 h-full rounded-r-full border-[1px] inline-flex items-center justify-center transition-colors duration-150",
                  useGrid
                    ? "bg-secondary/25 border-secondary/50 hover:bg-secondary/35"
                    : "bg-surface/75 dark:bg-surface-dark/75 hover:bg-surface hover:dark:bg-surface-dark border-surface dark:border-surface-dark"
                )}
                onClick={() => setUseGrid(true)}
                title="Grid layout"
              >
                <GridIcon/>
              </button>
            </div>
            <input
              type="file"
              name="file"
              multiple
              accept="*/*"
              id="file"
              className="hidden"
              onChange={async event =>
              {
                if ( !event.target.files ) return;
                await uploadFiles(event.target.files);
              }}
            />
            <label
              className={cn(
                "w-10 h-10 rounded-full bg-surface/75 dark:bg-surface-dark/75 hover:bg-surface hover:dark:bg-surface-dark border-surface dark:border-surface-dark inline-flex",
                "items-center justify-center p-2 cursor-pointer"
              )}
              title="Upload files"
              htmlFor="file"
            >
              <PlusIcon className="w-6 h-6"/>
            </label>
          </div>
        </div>
        <div
          className={cn(
            //"xxs:max-h-[calc(100vh-128px)] max-h-[calc(100vh-175px)]",
            "xxs:max-h-[calc(100vh-128px)] max-h-[calc(100vh-175px)]",
            isLoading
              ? "flex items-center justify-center"
              : "grid overflow-y-auto p-1 gap-2"
          )}
          style={(useGrid && !isLoading) ? ({ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }) : ({})}
        >
          {isLoading
            ? (
              <FunnyAnimation title="Loading... Please wait..."/>
            )
            : files.map((file, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg p-2 shadow bg-gradient-to-b select-none transition-colors duration-150 cursor-pointer",
                  useGrid ? "grid items-center justify-center text-center grid-cols-1" : "text-left space-x-4 flex flex-row",
                  selectedFileIds.includes(file.id)
                    ? "dark:from-secondary dark:to-primary from-secondary/40 to-primary/65"
                    : "from-surface/75 dark:from-surface-dark/75 to-surface/40 dark:to-surface-dark/40"
                )}
                onClick={event =>
                {
                  event.preventDefault();
                  const isSelected: boolean = selectedFileIds.includes(file.id);
                  const unSelect = () => setSelectedFileIds(selectedFileIds.filter(f => f !== file.id));
                  const select = () => setSelectedFileIds([ ...selectedFileIds, file.id ]);
                  if ( event.ctrlKey )
                  {
                    if ( isSelected )
                      unSelect();
                    else
                      select();
                  } else if ( event.shiftKey )
                  {
                    const lastSelected: string = selectedFileIds[selectedFileIds.length - 1];
                    const lastIndex: number = files.findIndex(f => f.id === lastSelected);
                    const currentIndex: number = files.findIndex(f => f.id === file.id);
                    const range: number[] = [ lastIndex, currentIndex ].sort((a, b) => a - b);
                    setSelectedFileIds(files.slice(range[0], range[1] + 1).map(f => f.id));
                  } else
                  {
                    setSelectedFileIds(isSelected ? [] : [ file.id ]);
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
                <div className={cn(
                  "h-full w-full grid grid-cols-1 gap-1",
                  useGrid ? "grid-cols-1" : "sm:grid-cols-4 xs:grid-cols-3 grid-cols-2"
                )}>
                  <p
                    className={cn("overflow-hidden whitespace-nowrap text-ellipsis", useGrid ? "text-xl" : "col-span-1 sm:col-auto")}
                    title={file.name}
                  >{file.name}</p>
                  <p
                    className={cn(!useGrid && "max-xs:hidden col-span-1 sm:col-auto")}
                    title={`${file.size} bytes`}
                  >{formatBytes(file.size)}</p>
                  <p
                    className={cn("", !useGrid && "max-xs:text-right col-span-1 sm:col-auto")}
                    title="Uploaded by"
                  >{file.username}</p>
                  <p
                    className={cn("", !useGrid && "max-sm:hidden col-span-1 sm:col-auto")}
                    title="Uploaded at"
                  >{formatDate(file.createdAt)}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}