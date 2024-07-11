"use server";

import { UserData } from "@/lib/definitions";
import { fallbackDiscordData } from "@/lib/fallbackData";

export default async function fromDiscord (): Promise<UserData>
{
  const userID: string = process.env.USERID ?? "719890634294427669";
  const token: string | undefined = process.env.TOKEN;
  
  if (!token) return fallbackDiscordData;
  
  const headers: Headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Authorization", `Bot ${token}`);
  
  const res: Response = await fetch(`https://discord.com/api/v10/users/${userID}`, {
    method: "GET",
    headers
  });
  
  if (!res.ok) return fallbackDiscordData;
  
  const data: any = await res.json();
  
  if (!data.username) return fallbackDiscordData;
  
  return {
    avatar: `https://cdn.discordapp.com/avatars/${userID}/${data.avatar}.webp?size=4096`,
    username: data.username ?? null,
    global_name: data.global_name ?? null
  };
}