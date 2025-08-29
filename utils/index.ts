import type { ValidationResult } from "@/types";

export function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getNumOfColumnns(itemCount: number) {
  if (itemCount <= 1) {
    return 1;
  }
  if (itemCount <= 4) {
    return 2;
  }
  if (itemCount <= 9) {
    return 3;
  }
  if (itemCount <= 12) {
    return 4;
  }
  if (itemCount <= 20) {
    return 5;
  }
  return 6;
}

export function validateName(
  player: string,
  playerRoster: string[],
): ValidationResult {
  let name = player.trim();
  name = name.replace(/\s+/g, " ");

  if (name.length > 14) {
    return {
      isValid: false,
      error: "Hey, can you make it shorter?",
    };
  }

  if (name.includes("\0")) {
    return {
      isValid: false,
      error: "This name seems sketchy, I don't know, try something else?",
    };
  }

  if (/^\s+$/.test(name)) {
    return {
      isValid: false,
      error: "This name seems empty to me, try again?",
    };
  }

  if (/[\r\n]/.test(name)) {
    return {
      isValid: false,
      error: "Can we keep it to one line?",
    };
  }

  if (playerRoster.includes(name)) {
    return {
      isValid: false,
      error: "Oh nooo! Name already taken!",
    };
  } else return { isValid: true, name: name };
}
