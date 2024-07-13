"use client";

import React, { useEffect } from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { fallbackDiscordData } from "@/lib/fallbackData";
import fromDiscord from "@/actions/getUserData";
import { UserData } from "@/lib/definitions";
import Image from "next/image";
import SMButton from "@/components/SMButton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IoLogoDiscord } from "react-icons/io5";
import { BsTelegram } from "react-icons/bs";
import { FaSteam } from "react-icons/fa6";
import { PiXLogo } from "react-icons/pi";
import {
  BiData,
  BiLogoCss3,
  BiLogoHtml5,
  BiLogoJava, BiLogoJavascript,
  BiLogoPython,
  BiLogoTailwindCss,
  BiLogoTypescript
} from "react-icons/bi";
import { mojang } from "@/lib/font";

export default function Home (): JSX.Element
{
  const [ loaded, setLoaded ] = React.useState<boolean>(false);
  const [ finished, setFinished ] = React.useState<boolean>(false);
  const [ username, setUsername ] = React.useState<string>(fallbackDiscordData.username);
  const [ avatar, setAvatar ] = React.useState<string>(fallbackDiscordData.avatar);
  const [ globalName, setGlobalName ] = React.useState<string | null>(fallbackDiscordData.global_name);
  
  useEffect(() =>
  {
    setLoaded(true);
    fromDiscord().then((data: UserData) =>
    {
      setUsername(data.username);
      if ( data.avatar ) setAvatar(data.avatar);
      setGlobalName(data.global_name);
    });
    setTimeout(() => setFinished(true), 1100);
  }, []);
  
  return (
    <main className={cn(
      "bg-gradient-to-br bg-cover bg-center from-indigo-500 via-purple-500 to-pink-500 w-full h-full min-h-screen min-w-screen",
      "flex justify-center max-sm:space-y-3 sm:space-x-5 p-3 sm:p-5 sm:flex-row flex-col",
    )}>
      <div className="grid max-sm:space-y-3 sm:space-y-5">
        <Card
          className="p-3 flex sm:flex-col flex-row max-sm:items-center max-sm:space-x-2 max-xs:flex-col sm:h-full sm:justify-center">
          <Image
            src={avatar}
            alt={`${username}'s avatar`}
            width={200}
            height={200}
            className={cn(
              "transition-all rounded-full hover:shadow-lg duration-300 ease-in-out",
              !loaded && "grayscale"
            )}
            style={finished ? ({}) : ({ transitionDelay: "1.1s" })}
          />
          <div className="w-full flex flex-col -space-y-2">
            <p
              className="sm:text-center max-xs:text-center text-black text-2xl max-sm:text-4xl max-xs:text-2xl">{globalName}</p>
            <p
              className="sm:text-center max-xs:text-center text-black/50 text-lg max-sm:text-3xl max-xs:text-lg">{`@${username}`}</p>
          </div>
        </Card>
        <Card className="flex flex-col space-y-2 items-center justify-center">
          <h2>Technologies</h2>
          <div className="grid sm:grid-cols-1 xs:grid-cols-2 grid-cols-1 gap-2 w-full">
            <SMButton
              color="#E44D26"
              name="HTML"
              logo={<BiLogoHtml5/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.1s" })}
            />
            <SMButton
              color="#38bdf8"
              name="CSS"
              logo={<BiLogoCss3/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.3s" })}
            />
            <SMButton
              color="#F0DB4F"
              name="JavaScript"
              logo={<BiLogoJavascript/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.5s" })}
            />
            <SMButton
              color="#3178c6"
              name="TypeScript"
              logo={<BiLogoTypescript/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.5s" })}
            />
            <SMButton
              color="#f89820"
              name="Java"
              logo={<BiLogoJava/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.7s" })}
            />
            <SMButton
              color="#306998"
              name="Python"
              logo={<BiLogoPython/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.9s" })}
            />
            <SMButton
              color="#008bb9"
              name="SQL"
              logo={<BiData/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "1.1s" })}
            />
          </div>
        </Card>
        <Card className="flex flex-col space-y-2 items-center justify-center">
          <h2>Social Media</h2>
          <div className="grid sm:grid-cols-1 xs:grid-cols-2 grid-cols-1 gap-2 w-full">
            <SMButton
              color="#5865F2"
              name="Discord"
              link="https://discord.com/users/719890634294427669"
              logo={<IoLogoDiscord/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.2s" })}
            />
            <SMButton
              color="#000000"
              name="GitHub"
              link="https://github.com/0xe0b69e"
              logo={<GitHubLogoIcon/>}
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.4s" })}
            />
            <SMButton
              color="#000000"
              name="X"
              link="https://x.com/0xe0b69e"
              logo={<PiXLogo/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.6s" })}
            />
            <SMButton
              color="#49a9e9"
              name="Telegram"
              link="https://t.me/e0b69e"
              logo={<BsTelegram/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "0.8s" })}
            />
            <SMButton
              color="#000000"
              name="Steam"
              link="https://steamcommunity.com/id/0xe0b69e"
              logo={<FaSteam/>}
              
              className={cn(
                !loaded && "-translate-x-20 opacity-0",
                "transition-all duration-300 ease-in-out"
              )}
              style={finished ? ({}) : ({ transitionDelay: "1s" })}
            />
          </div>
        </Card>
      </div>
      <Card className="sm:w-full max-sm:h-full max-sm:flex max-sm:justify-center">
        <div className="inline-flex flex-col space-y-1">
          <p className={cn(
            "text-lg font-bold text-indigo-500",
            mojang.className
          )}>
            Friendly survival server:
          </p>
          <div className="inline-flex xs:flex-row max-xs:flex-col items-center xs:space-x-1 max-xs:space-y-1">
            <input
              value="mc.j3rzy.dev"
              readOnly
              className={cn(
                "focus-visible:outline-none p-2 text-lg text-white bg-black border-2 border-white max-sm:w-full",
                mojang.className
              )}
              style={{
                textShadow: "2px 2px #4C4C4C"
              }}
              onClick={(e) =>
              {
                if ( navigator.clipboard ) navigator.clipboard.writeText("mc.j3rzy.dev").then(() => console.log("Copied to clipboard!"))
              }}
            />
            <button
              className={cn(
                "minecraft-btn mx-auto sm:w-32 w-full text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200",
                mojang.className
              )}
            >
              Copy
            </button>
          </div>
        </div>
      </Card>
    </main>
  )
}