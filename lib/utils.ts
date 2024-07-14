import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn: (...inputs: ClassValue[]) => string = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Darkens a hex color by a specified amount.
 * If you want to lighten a color, just use a negative number.
 * @param hex
 * @param darkenAmount
 */
export function darkenHexColor (hex: string, darkenAmount: number = 16): string
{
  let r: number = parseInt(hex.slice(1, 3), 16);
  let g: number = parseInt(hex.slice(3, 5), 16);
  let b: number = parseInt(hex.slice(5, 7), 16);
  
  r = Math.max(0, r - darkenAmount);
  g = Math.max(0, g - darkenAmount);
  b = Math.max(0, b - darkenAmount);
  
  const rHex: string = r.toString(16).padStart(2, "0");
  const gHex: string = g.toString(16).padStart(2, "0");
  const bHex: string = b.toString(16).padStart(2, "0");
  
  return `#${rHex}${gHex}${bHex}`;
}

export function isBlack (hex: string): boolean
{
  const threshold: number = 0x10;
  
  const r: number = parseInt(hex.slice(1, 3), 16);
  const g: number = parseInt(hex.slice(3, 5), 16);
  const b: number = parseInt(hex.slice(5, 7), 16);
  
  return r < threshold && g < threshold && b < threshold;
}

export async function convertFileToBase64 (file: File): Promise<string>
{
  return new Promise((resolve, reject) =>
  {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

export function formatBytes (bytes: number, decimals: number = 2): string
{
  if ( bytes === 0 ) return "0 Bytes";
  
  const k: number = 1024;
  const dm: number = decimals < 0 ? 0 : decimals;
  const sizes: string[] = [ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ];
  
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const formatDate = (date: Date): string => "";