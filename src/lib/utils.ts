import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pseudoRandom(seedInt: number): number {
  let t = (seedInt += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 8), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getShuffledOptions(
  questionId: string,
  options: string[],
  seedStr: string = ""
): { shuffledOptions: string[]; mapShuffledToOriginal: number[]; mapOriginalToShuffled: number[] } {
  const seedVal = hashString(`${questionId}:${seedStr}`);
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const r = pseudoRandom(seedVal + i);
    const j = Math.floor(r * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const shuffledOptions = indices.map((idx) => options[idx]);
  const mapOriginalToShuffled = new Array(options.length);
  indices.forEach((origIdx, newIdx) => {
    mapOriginalToShuffled[origIdx] = newIdx;
  });

  return {
    shuffledOptions,
    mapShuffledToOriginal: indices,
    mapOriginalToShuffled,
  };
}
