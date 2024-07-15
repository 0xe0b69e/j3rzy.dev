"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import tailwind from "@/tailwind.config";

interface FunnyAnimationProps
{
  title?: string;
}

export default function FunnyAnimation ({ title }: FunnyAnimationProps): JSX.Element
{
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [ frame, setFrame ] = useState<number>(0);
  const [ textFrame, setTextFrame ] = useState<number>(0);
  const [ velocity, setVelocity ] = useState<number>(0);
  const [ circleY, setCircleY ] = useState<number>(36);
  
  const pathname: string = usePathname();
  
  const positions: ({ y: number, size: number })[] = useMemo(() =>
  {
    const numbers: number[] = [];
    let current = 0;
    
    while ( current < 200 )
    {
      const increment = Math.floor(Math.random() * 20) + 20; // Adjust the range of increment as needed
      current += increment;
      if ( current <= 200 )
      {
        numbers.push(current);
      }
    }
    return numbers.map(y => ({ y, size: Math.floor(Math.random() * 3) + 5 }));
  }, []);
  
  useEffect(() =>
  {
    if ( !canvasRef.current ) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    
    const gravity: number = 0.4;
    const bounceFactor: number = -0.7;
    const groundY: number = 36;
    const jumpHeight: number = -3;
    
    const darkMode: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const text: string = title ?? `https://j3rzy.dev${pathname}`;
    
    const drawLine = (x1: number, y1: number, x2: number, y2: number) =>
    {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    
    const drawCircle = (x: number, y: number, radius: number, fill: boolean) =>
    {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      if ( fill ) ctx.fill();
      ctx.stroke();
    };
    
    const drawTriangle = (x: number, y: number, size: number, fill: boolean) =>
    {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size / 2, y - size);
      ctx.closePath();
      if ( fill ) ctx.fill();
      ctx.stroke();
    };
    
    const animate = () =>
    {
      if ( !canvasRef.current ) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.font = "17px monospace";
      
      const textWidth: number = ctx.measureText(text).width;
      const x: number = ((canvas.width - textFrame) % (canvas.width + textWidth)) - textWidth;
      ctx.fillText(text, x, canvas.height / 2 - 10);
      
      positions.forEach(({ y, size }) =>
      {
        ctx.fillStyle = tailwind.theme?.extend?.colors.secondary ?? "red";
        ctx.strokeStyle = tailwind.theme?.extend?.colors.secondary ?? "red";
        let newX = ((frame - y) + canvas.width) % canvas.width;
        drawTriangle(newX, 40, size, true);
      });
      
      const touchesSpike = positions.some(({ y, size }) =>
      {
        let newX = ((frame - y) + canvas.width) % canvas.width;
        return newX > 49 - size && newX < 51 + size;
      });
      
      if ( touchesSpike && circleY >= groundY )
      {
        setVelocity(jumpHeight);
      }
      
      setVelocity(velocity => velocity + gravity);
      setCircleY(y =>
      {
        let newY = y + velocity;
        if ( newY > groundY )
        {
          newY = groundY;
          setVelocity(velocity => velocity * bounceFactor); // Bounce back
        }
        return newY;
      });
      
      ctx.fillStyle = darkMode ? "rgb(52,255,250)" : "rgb(93,0,255)";
      ctx.strokeStyle = darkMode ? "rgb(52,255,250)" : "rgb(93,0,255)";
      drawCircle(50, circleY, 3, true);
      
      ctx.strokeStyle = "black";
      drawLine(0, 40, canvas.width, 40);
      
      setFrame(frame => (frame - 1 + canvas.width) % canvas.width);
      setTextFrame(textFrame => textFrame - 1);
    };
    
    const animationId: number = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [ circleY, frame, pathname, positions, textFrame, velocity ]);
  
  return <canvas ref={canvasRef} width="200" height="48" className="rounded-md"/>;
}