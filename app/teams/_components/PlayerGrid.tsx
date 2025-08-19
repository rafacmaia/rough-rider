interface PlayerGridProps {
  players: string[];
  onPlayerSelection: (player: string) => void;
  assignedPlayers: string[];
}

export default function PlayerGrid({
  players,
  onPlayerSelection,
  assignedPlayers,
}: PlayerGridProps) {
  return (
    <>
      {players.map((player) => {
        const isAssigned = assignedPlayers.includes(player);
        return (
          <button
            key={player}
            disabled={isAssigned}
            onClick={() => onPlayerSelection(player)}
            className={`h-26 w-28 rounded-md border-4 border-black bg-accent p-4 text-2xl font-semibold shadow-lg ${isAssigned ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-accent/40"}`}
          >
            {player}
          </button>
        );
      })}
    </>
  );
}
