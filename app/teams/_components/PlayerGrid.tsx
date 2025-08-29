import { useState } from "react";
import { getNumOfColumnns, validateName } from "@/utils";
import type { ValidationResult } from "@/types";

interface PlayerGridProps {
  players: string[];
  handlePlayerSelection: (player: string) => void;
  handleNewPlayer: (player: string) => void;
  assignedPlayers: string[];
  disable: boolean;
}

export default function PlayerGrid({
  players,
  handlePlayerSelection,
  handleNewPlayer,
  assignedPlayers,
  disable,
}: PlayerGridProps) {
  const [addPlayerMode, setAddPlayerMode] = useState<boolean>(false);
  const [newPlayer, setNewPlayer] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const cols = getNumOfColumnns(players.length + 2);

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      const validation: ValidationResult = validateName(newPlayer, players);

      if (!validation.isValid) {
        setErrorText(validation.error);
        setNewPlayer("");
        return;
      }

      handleNewPlayer(validation.name);
      setTimeout(() => setAddPlayerMode(false), 100);
    } else {
      setTimeout(() => setAddPlayerMode(false), 100);
    }
    setNewPlayer("");
    setErrorText("");
  };

  return (
    <section
      className={`relative grid h-fit place-items-center gap-2 font-footer ${disable && "pointer-events-none opacity-70"}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {players.map((player) => {
        const isAssigned = assignedPlayers.includes(player);
        const isDisabled = isAssigned || addPlayerMode;
        return (
          <button
            key={player}
            disabled={isDisabled}
            onClick={() => handlePlayerSelection(player)}
            className={`h-26 w-28 rounded-md border-4 border-black bg-accent p-4 text-2xl font-semibold shadow-lg ${isAssigned || addPlayerMode ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:border-red-500/75 hover:bg-accent/40"}`}
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
            handleAddPlayer();
          }}
        >
          {errorText && <ErrorAlert message={errorText} />}
          <input
            className={`h-full w-full rounded-md border-4 border-black bg-accent p-4 text-center text-2xl font-semibold caret-red-600 shadow-2xl placeholder:opacity-60 focus:outline-none`}
            type="text"
            placeholder={``}
            enterKeyHint="done"
            autoFocus
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onBlur={handleAddPlayer}
          />
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
      className={`order-last h-26 w-28 cursor-pointer rounded-md border-4 border-black bg-tertiary/90 p-1 text-2xl font-semibold capitalize shadow-lg hover:border-red-500/75 hover:bg-tertiary/60`}
      style={{ gridColumnStart: gridPosition }}
    >
      {label}
    </button>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      className={`absolute right-36 bottom-20 max-w-xs rounded-full rounded-br-none border-2 border-red-600 bg-red-200 py-4 pr-5 pl-7 text-center text-lg/4 font-bold tracking-wider`}
      // className={`absolute right-0 bottom-27 w-58 rounded-t-4xl rounded-b-none border-3 border-red-600 bg-red-200 px-8 py-3 text-center text-lg/5 font-bold tracking-wider`}
    >
      {message}
    </div>
  );
}
