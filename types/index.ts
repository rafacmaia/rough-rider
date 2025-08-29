export interface Player {
  name: string;
  score: number;
}

export interface Team {
  id: number;
  player1: Player;
  player2: Player;
  wins: number;
  losses: number;
  plays: number;
  status: string;
}

export interface ValidationSuccess {
  isValid: true;
  name: string;
}

export interface ValidationError {
  isValid: false;
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;
