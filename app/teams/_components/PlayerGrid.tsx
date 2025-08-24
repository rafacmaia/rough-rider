import { getNumOfColumnns } from "@/utils";
import { useState } from "react";

interface PlayerGridProps {
  players: string[];
  handlePlayerSelection: (player: string) => void;
  handleNewPlayer: (player: string) => void;
  assignedPlayers: string[];
}

export default function PlayerGrid({
  players,
  handlePlayerSelection,
  handleNewPlayer,
  assignedPlayers,
}: PlayerGridProps) {
  const [addPlayerMode, setAddPlayerMode] = useState<boolean>(false);
  const [newPlayer, setNewPlayer] = useState<string>("");
  const cols = getNumOfColumnns(players.length + 2);

  const handleSubmit = () => {
    if (newPlayer.trim()) {
      handleNewPlayer(newPlayer);
      setNewPlayer("");
    }
    setAddPlayerMode(false);
  };

  return (
    <section
      className={`relative grid h-fit place-items-center gap-2 font-footer`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {players.map((player) => {
        const isAssigned = assignedPlayers.includes(player);
        return (
          <button
            key={player}
            disabled={isAssigned || addPlayerMode}
            onClick={() => handlePlayerSelection(player)}
            className={`h-26 w-28 rounded-md border-4 border-black bg-accent p-4 text-2xl font-semibold shadow-lg ${isAssigned || addPlayerMode ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:border-red-600 hover:bg-accent/40"}`}
          >
            {player}
          </button>
        );
      })}
      {addPlayerMode && (
        <form
          className={`col-span-2 h-26 w-58`}
          style={{ gridColumnStart: cols - 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Alt styling for input field:
              placeholder:underline placeholder:decoration-red-600/50 placeholder:decoration-wavy placeholder:decoration-2 */}
          <input
            className={`h-full w-full rounded-md border-4 border-black bg-accent p-4 text-center text-2xl font-semibold caret-red-600 shadow-2xl focus:outline-none`}
            type="text"
            placeholder={``}
            enterKeyHint="done"
            autoFocus
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onBlur={handleSubmit}
          ></input>
        </form>
      )}

      {!addPlayerMode && (
        <>
          <ConfigButton
            label={`remove rider`}
            handleClick={() => null}
            gridPosition={players.length % cols === 4 ? cols : cols - 1}
          />
          <ConfigButton
            label={`add rider`}
            handleClick={() => setAddPlayerMode(true)}
            gridPosition={cols}
          />
        </>
      )}
    </section>
  );
}

interface ConfigButtonProps {
  label: string;
  handleClick: () => void;
  gridPosition: number;
}
function ConfigButton({ label, handleClick, gridPosition }: ConfigButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`order-last h-26 w-28 cursor-pointer rounded-md border-4 border-black bg-tertiary p-1 text-2xl font-semibold capitalize shadow-lg hover:bg-tertiary/60`}
      style={{ gridColumnStart: gridPosition }}
    >
      {label}
    </button>
  );
}
