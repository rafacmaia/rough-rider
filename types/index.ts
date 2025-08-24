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
