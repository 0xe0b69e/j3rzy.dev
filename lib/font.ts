import { Varela_Round } from "next/font/google";
import { NextFont } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";

export const varelaRound: NextFont = Varela_Round({ subsets: [ "latin" ], weight: "400" });

export const mojang: NextFont = localFont({
  src: [
    {
      path: "../assets/Mojang-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../assets/Mojang-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ]
});