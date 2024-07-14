import { cn } from "@/lib/utils";
import { SiLua } from "react-icons/si";
import { CiFileOn } from "react-icons/ci";
import { LuFileJson } from "react-icons/lu";
import {
  PiFileArchive,
  PiFileAudio, PiFileC, PiFileCpp, PiFileCSharp,
  PiFileCss, PiFileDoc,
  PiFileHtml,
  PiFileImage,
  PiFileJs, PiFileMd, PiFilePdf, PiFilePy, PiFileRs, PiFileSql, PiFileSvg,
  PiFileText,
  PiFileTs,
  PiFileVideo
} from "react-icons/pi";
import { BsFiletypeExe, BsFiletypeJava, BsFiletypePhp, BsFiletypeRb } from "react-icons/bs";
import { TbBrandGolang, TbBrandKotlin, TbBrandSwift } from "react-icons/tb";
import { VscTerminal } from "react-icons/vsc";
import { FaRegFloppyDisk } from "react-icons/fa6";

interface FileIconProps
{
  fileName: string;
  className?: string;
}

export default function FileIcon ({ fileName, className = "" }: FileIconProps): JSX.Element
{
  className = cn("w-6 h-6", className);
  
  switch ( fileName.split(".").pop() )
  {
    // Media files
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <PiFileImage className={className}/>;
    case "mp3":
    case "wav":
    case "ogg":
      return <PiFileAudio className={className}/>;
    case "mp4":
    case "webm":
    case "avi":
    case "mov":
    case "flv":
    case "mkv":
      return <PiFileVideo className={className}/>;
    case "svg":
    case "bmp":
      return <PiFileSvg className={className}/>;
    // Document files
    case "pdf":
      return <PiFilePdf className={className}/>;
    case "doc":
    case "docx":
    case "ppt":
    case "pptx":
    case "xls":
    case "xlsx":
      return <PiFileDoc className={className}/>;
    // Code files
    case "exe":
      return <BsFiletypeExe className={className}/>;
    case "js":
    case "jsx":
      return <PiFileJs className={className}/>;
    case "ts":
    case "tsx":
      return <PiFileTs className={className}/>;
    case "lua":
      return <SiLua className={className}/>;
    case "yaml":
    case "yml":
    case "xml":
    case "conf":
    case "cfg":
    case "json":
      return <LuFileJson className={className}/>;
    case "html":
    case "htm":
      return <PiFileHtml className={className}/>;
    case "css":
    case "scss":
    case "sass":
      return <PiFileCss className={className}/>;
    case "java":
    case "class":
      return <BsFiletypeJava className={className}/>;
    case "py":
      return <PiFilePy className={className}/>;
    case "c":
    case "h":
      return <PiFileC className={className}/>;
    case "cpp":
      return <PiFileCpp className={className}/>;
    case "cs":
      return <PiFileCSharp className={className}/>;
    case "php":
      return <BsFiletypePhp className={className}/>;
    case "rb":
      return <BsFiletypeRb className={className}/>;
    case "swift":
      return <TbBrandSwift className={className}/>;
    case "go":
      return <TbBrandGolang className={className}/>;
    case "rs":
      return <PiFileRs className={className}/>;
    case "kt":
      return <TbBrandKotlin className={className}/>;
    case "sh":
    case "bat":
      return <VscTerminal className={className}/>;
    case "sql":
      return <PiFileSql className={className}/>;
    case "md":
      return <PiFileMd className={className}/>;
    // Archive files
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
    case "bz2":
      return <PiFileArchive className={className}/>;
    case "iso":
    case "img":
      return <FaRegFloppyDisk className={className}/>;
    // Misc files
    case "txt":
      return <PiFileText className={className}/>;
    default:
      return <CiFileOn className={className}/>;
  }
};