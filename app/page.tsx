"use client";

import { cn } from "@/lib/utils";
import { NerkoOne } from "@/lib/fonts";
import React from "react";

export default function Home(): JSX.Element {
  const texts: string[] = React.useMemo(() =>
    [
      "All players wait until it is very dark and your parents have fallen asleep.",
      "Sneak outside very quietly and gather all of your friends.",
      "Go into the woods.",
      "Walk until you cannot see the lights anymore.",
      "Scream on the top of your lungs.",
      ""
    ], []);

  const fadeDuration: number = 1500;
  const delay: number = fadeDuration + 3000;
  const noTextDelay: number = 1000;

  const [text, setText] = React.useState<string>(texts[0]);
  const [isFading, setIsFading] = React.useState<boolean>(false);
  const [isTextHidden, setIsTextHidden] = React.useState<boolean>(false);

  React.useEffect(() => {
    let i: number = 0;

    const changeText = () => {
      setIsFading(true);
      setTimeout(() => {
        setIsTextHidden(true);
        setTimeout(() => {
          i++;
          if (i >= texts.length) i = 0;
          setText(texts[i]);
          setIsTextHidden(false);
          setIsFading(false);
        }, noTextDelay);
      }, fadeDuration);
    };

    const interval: NodeJS.Timeout = setInterval(changeText, delay + noTextDelay);

    return () => clearInterval(interval);
  }, [delay, fadeDuration, noTextDelay, texts]);

  return (
    <main className="w-full h-full bg-[#3a1911] flex flex-col items-center space-y-20">
      <div className="w-[1000px] h-80 bg-[#52261c] -rotate-12 absolute -top-[250px] -left-[400px] shadow-2xl z-10"/>
      <div className="w-[1000px] h-80 bg-[#52261c] -rotate-12 absolute -bottom-[270px] -right-[400px] shadow-2xl z-10"/>
      <h1
        className={cn("uppercase text-[100px] text-[#a97e4f] m-0 z-20 text-center leading-[65px]", NerkoOne.className)}
        style={{ textShadow: "-7px 7px 2px #000" }}
      >Feed the woods</h1>
      <p
        className="font-serif text-[30px] font-semibold z-20 transition-opacity text-center text-white"
        style={{
          textShadow: "-3px 3px 1px #000",
          opacity: isFading || isTextHidden ? 0 : 1,
          transitionDuration: `${fadeDuration}ms`
        }}
      >{text}</p>
    </main>
  );
}
