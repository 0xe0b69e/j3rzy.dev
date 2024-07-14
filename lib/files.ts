import UploadFile from "@/actions/files";
import { convertFileToBase64 } from "@/lib/utils";

export const uploadFile = async (file: File): Promise<boolean> => UploadFile(file.name, await convertFileToBase64(file));