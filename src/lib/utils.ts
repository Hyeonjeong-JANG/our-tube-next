import { EchoCommand } from "@upstash/redis";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration: number) => {
  const seconds = Math.floor((duration & 60000) / 1000);
  const minute = Math.floor(duration / 60000);
  return `${minute.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
