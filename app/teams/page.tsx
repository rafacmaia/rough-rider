"use client";
import { JSX, useState, useEffect } from "react";
import { ArrowBigRight, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getPlayers,
  addTeams,
  resetTournament,
  addPlayer,
} from "@fb/firestore";
import { shuffleArray } from "@/utils";
import PlayerGrid from "./_components/PlayerGrid";
import { Player } from "@/types";
import LoadingPage from "@/components/LoadingPage";

export default function TeamsPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayers, setNewPlayers] = useState<string[]>([]);
  const [assignedPlayers, setAssignedPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeTournament = async () => {
      try {
        setLoading(true);
        await resetTournament();
        const players = await getPlayers();
        setPlayers(shuffleArray(players));
      } catch (e) {
        console.error("Error retrieving data: ", e);
      } finally {
        setLoading(false);
      }
    };

    void initializeTournament();
  }, []);

  const handleNewPlayer = (name: string) => {
    setNewPlayers([...newPlayers, name]);
    setPlayers([...players, { name: name, score: 0 }]);
  };

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
      for (const player of newPlayers) {
        await addPlayer(player);
      }
      await addTeams(teams);
      router.push("/tournament-setup");
    } catch (e) {
      console.error("Error adding teams to database: ", e);
    }
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center font-light">
      <header
        className={`w-screen flex-none items-center justify-center pt-18 text-center underline decoration-red-600 decoration-wavy decoration-4 underline-offset-18 ${assignedPlayers.length === players.length && "opacity-40"}`}
      >
        {/*<Flame className="text-red-600" size={40} />*/}
        <h1 className="font-header text-6xl font-extrabold">Team Selection</h1>
        {/*<Flame className="text-red-600" size={40} />*/}
      </header>

      <div className="relative mt-16 mb-6 flex grow items-center">
        <PlayerGrid
          players={players.map((player) => player.name)}
          handlePlayerSelection={handlePlayerSelection}
          handleNewPlayer={handleNewPlayer}
          assignedPlayers={assignedPlayers}
        />
        {assignedPlayers.length === players.length && (
          <button
            onClick={handleStartTournament}
            className="absolute inset-x-0 top-1/2 m-auto flex h-24 w-100 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border-6 bg-accent p-4 text-center font-header-alt text-4xl font-black text-black hover:bg-black hover:text-accent"
          >
            Start Tournament
            <ArrowBigRight size={30} className="ml-2" strokeWidth={3} />
          </button>
        )}
      </div>

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
        className={`flex w-full items-center rounded-md border-4 p-3 font-bold ${teams.length === numOfTeams ? "border-yellow-300 bg-slate-800 text-yellow-300" : "border-black bg-yellow-300 text-black"}`}
      >
        <Flame
          className={`mx-2 shrink-0 text-red-alt`}
          strokeWidth={3}
          size={25}
        />
        <h3 className="inline-block font-header text-xl/10 tracking-wide text-nowrap">
          Team {i + 1} :
        </h3>{" "}
        <span className="ml-2 flex w-full items-center justify-between font-footer text-[1.6rem]">
          {team.join(" + ")}
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
        className="flex w-full items-center rounded-md border-4 border-red-600/75 bg-yellow-300 p-3 pl-8 font-bold text-black"
      >
        <h3 className="inline-block font-header text-xl/10 tracking-wide">
          Team {teamList.length + 1} :
        </h3>{" "}
        <span className="ml-2 font-footer text-[1.6rem]">
          {selectedPlayer} +
        </span>
      </li>,
    );
  }

  for (let i = 0; teamList.length < numOfTeams; i++) {
    teamList.push(
      <li
        key={teamList.length}
        className={`flex w-full items-center rounded-md border-4 border-black p-3 pl-8 ${i === 0 && selectedPlayer === "" ? "border-red-600/75 bg-yellow-300 font-bold text-black" : "bg-yellow-300/60 text-black/80"}`}
      >
        <h3 className="inline-block font-header text-xl/10 tracking-wide">
          Team {teamList.length + 1} :
        </h3>{" "}
      </li>,
    );
  }

  return (
    <section className="flex w-screen border-t-4 border-black bg-slate-800">
      <ol
        className={`mx-auto grid w-full grid-cols-1 place-content-center place-items-stretch gap-x-4 gap-y-2 p-6 text-xl text-slate-950 sm:grid-cols-2 xl:grid-cols-3`}
      >
        {teamList}
      </ol>
    </section>
  );
}
