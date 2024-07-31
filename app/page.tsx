"use client";

import { useEffect, useRef } from "react";

export default function Home(): JSX.Element {
  const text: string = "I'm in your walls...";
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  function getRandomInt(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  
  useEffect(() => {
    function moveRandomly(element: HTMLElement) {
      const x: number = getRandomInt(-1, 1);
      const y: number = getRandomInt(-1, 1);
      const speed: number = getRandomInt(0.05, 0.2);
      
      element.style.transition = `transform ${speed}s linear`;
      element.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    const intervals = letterRefs.current.map((element, index) => {
      if (!element) return null;
      
      const intervalId: NodeJS.Timeout = setInterval(() => moveRandomly(element), 100);
      
      moveRandomly(element);
      
      return intervalId;
    });
    
    return () => intervals.forEach(intervalId => intervalId && clearInterval(intervalId));
  }, []);
  
  return (
    <main className="w-full h-full bg-black text-white flex items-center justify-center font-mono text-3xl text-center">
      <div>
        {text.split("").map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </main>
  );
}
