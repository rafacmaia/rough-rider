"use client";
import { JSX, useState, useEffect } from "react";
import { ArrowBigRight, Flame, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { shuffleArray, addTeams } from "@fb/firestore";
import PlayerGrid from "./_components/PlayerGrid";
import players from "@fb/seed-data";

export default function TeamsPage() {
  const router = useRouter();
  const [shuffledPlayers, setShuffledPlayers] = useState<string[]>(players);
  const [assignedPlayers, setAssignedPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  useEffect(() => {
    setShuffledPlayers(shuffleArray(players));
  }, []);

  const handlePlayerSelection = (player: string) => {
    if (assignedPlayers.includes(player)) {
      return;
    }
    setAssignedPlayers((prev) => [...prev, player]);

    if (selectedPlayer === "") {
      setSelectedPlayer(player);
    } else {
      setTeams((prev) => [...prev, [selectedPlayer, player]]);
      setSelectedPlayer("");
    }
  };

  async function handleStartTournament() {
    try {
      await addTeams(teams);
      router.push("/tournament-setup");
    } catch (e) {
      console.error("Error adding teams to database: ", e);
    }
  }

  return (
    <main className="flex h-dvh flex-col items-center justify-center font-light">
      <header
        className={`flex h-1/5 w-screen items-center justify-center pt-2 underline decoration-red-600 decoration-wavy decoration-4 underline-offset-20 ${assignedPlayers.length === players.length && "opacity-40"}`}
      >
        {/*<Flame className="text-red-600" size={40} />*/}
        <h1 className="mx-6 font-header text-6xl font-extrabold">
          Team Selection
        </h1>
        {/*<Flame className="text-red-600" size={40} />*/}
      </header>

      <section className="relative my-auto grid h-fit grid-cols-4 content-center gap-2 p-2 font-footer">
        <PlayerGrid
          players={shuffledPlayers}
          onPlayerSelection={handlePlayerSelection}
          assignedPlayers={assignedPlayers}
        />
        {assignedPlayers.length === players.length && (
          <button
            onClick={handleStartTournament}
            className="absolute inset-x-0 top-1/2 m-auto flex h-24 w-100 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-6 bg-yellow-300 p-4 text-center font-header-alt text-4xl font-black text-black hover:bg-black hover:text-yellow-300"
          >
            Start Tournament
            <ArrowBigRight size={30} className="ml-2" strokeWidth={3} />
          </button>
        )}
      </section>

      <TeamDisplay
        numOfPlayers={players.length}
        teams={teams}
        selectedPlayer={selectedPlayer}
      />
    </main>
  );
}

interface TeamDisplayProps {
  numOfPlayers: number;
  teams: string[][];
  selectedPlayer: string;
}

function TeamDisplay({
  numOfPlayers,
  teams,
  selectedPlayer,
}: TeamDisplayProps) {
  const numOfTeams = numOfPlayers / 2;
  let teamList: JSX.Element[] = [];

  teams.map((team, i) => {
    teamList.push(
      <li
        key={teamList.length}
        className={`flex min-w-120 items-center rounded-md border-4 p-3 font-bold ${teams.length === numOfTeams ? "border-yellow-300 bg-slate-800 text-yellow-300" : "border-black bg-yellow-300 text-black"}`}
      >
        <Flame
          className={`mx-2 shrink-0 text-red-alt`}
          strokeWidth={3}
          size={25}
        />
        <h3 className="inline-block font-header-alt text-xl/10 tracking-wide text-nowrap">
          Team {i + 1} :
        </h3>{" "}
        <span className="ml-1 flex w-full items-center justify-between font-footer text-2xl">
          {team.join(", ")}
          <Flame
            className={`mx-2 shrink-0 text-red-alt`}
            strokeWidth={3}
            size={25}
          />
        </span>
      </li>,
    );
  });

  if (selectedPlayer !== "") {
    teamList.push(
      <li
        key={teamList.length}
        className="flex min-w-120 items-center rounded-md border-4 border-black bg-yellow-300/85 p-3 pl-8 font-bold text-black/85"
      >
        <h3 className="inline-block font-header-alt text-xl/10 tracking-wide">
          Team {teamList.length + 1} :
        </h3>{" "}
        <span className="ml-1 font-footer text-2xl">{selectedPlayer},</span>
      </li>,
    );
  }

  while (teamList.length < numOfTeams) {
    teamList.push(
      <li
        key={teamList.length}
        className="flex w-120 items-center rounded-md border-4 border-black bg-yellow-300/70 p-3 pl-8 text-black/80"
      >
        <h3 className="inline-block font-header-alt text-xl/10 tracking-wide">
          Team {teamList.length + 1} :
        </h3>{" "}
      </li>,
    );
  }

  return (
    <section className="mt-auto flex w-screen border-t-5 border-black bg-slate-800 font-body">
      <ol
        className={`mx-auto grid min-w-3xl grid-cols-2 place-content-center gap-x-5 gap-y-2 p-7 text-xl text-slate-950`}
      >
        {teamList}
      </ol>
    </section>
  );
}
