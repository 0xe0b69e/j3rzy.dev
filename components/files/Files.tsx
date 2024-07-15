"use client";

import { cn, formatBytes, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import FileIcon from "@/components/files/FileIcon";
import { Cross1Icon, DownloadIcon, GridIcon, HamburgerMenuIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { FileData } from "@/lib/definitions";
import { deleteFiles, DeleteFilesResponse, getFiles } from "@/actions/files";

export default function Files (): JSX.Element
{
  const [ useGrid, setUseGrid ] = useState<boolean>(false);
  const [ selectedFileIds, setSelectedFileIds ] = useState<string[]>([]);
  const [ files, setFiles ] = useState<FileData[]>([]);
  
  // TODO: Do something with the response
  const [ deleteFileResponse, setDeleteFileResponse ] = useState<DeleteFilesResponse | null>(null);
  
  useEffect(() =>
  {
    const fetchFiles = async () => setFiles(await getFiles());
    fetchFiles().then();
  }, []);
  
  const selectedFiles: FileData[] = selectedFileIds.map(id => files.find(f => f.id === id)).filter(Boolean) as FileData[];
  const canEditSelectedFiles = !selectedFiles.map(f => f.canEdit).includes(false);
  
  return (
    <div className="flex flex-col gap-2 p-2">
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
            title={canEditSelectedFiles
              ? "Delete selected"
              : `You don't have permission to edit ${selectedFiles.filter(f => !f.canEdit).map(f => f.name).join(", ")}`}
            onClick={async () =>
            {
              if ( !canEditSelectedFiles ) return;
              const response: DeleteFilesResponse = await deleteFiles(selectedFileIds);
              setDeleteFileResponse(response);
            }}
            disabled={!canEditSelectedFiles}
          >
            <TrashIcon className="group-disabled:text-black/25 group-disabled:dark:text-white/25"/>
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
          <button
            className={cn(
              "w-10 h-10 rounded-full bg-surface/75 dark:bg-surface-dark/75 hover:bg-surface hover:dark:bg-surface-dark border-surface dark:border-surface-dark inline-flex",
              "items-center justify-center p-2"
            )}
            title="Upload file"
          >
            <PlusIcon className="w-6 h-6"/>
          </button>
        </div>
      </div>
      <div
        className="grid xxs:max-h-[calc(100vh-128px)] max-h-[calc(100vh-175px)] overflow-y-auto p-1 gap-2"
        style={useGrid ? ({ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }) : ({})}
      >
        {files.map((file, index) => (
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
                {
                  unSelect();
                } else
                {
                  select();
                }
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
              "h-full w-full grid",
              useGrid
                ? "grid-cols-1"
                : "sm:grid-cols-4 xs:grid-cols-3 grid-cols-2"
            )}>
              <p className={cn(useGrid && "text-xl")}>{file.name}</p>
              <p className={cn(!useGrid && "max-xs:hidden")}>{formatBytes(file.size)}</p>
              <p className={cn(!useGrid && "max-xs:text-right")}>{file.username}</p>
              <p className={cn(!useGrid && "max-sm:hidden")}>{formatDate(file.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}