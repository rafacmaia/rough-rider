"use client";
import Bracket from "./_components/Bracket";
import { useEffect, useState } from "react";
import { DocumentData } from "@firebase/firestore";
import { getMatches, getTeams } from "@fb/firestore";
import LoadingPage from "@/components/LoadingPage";

export default function TournamentPage() {
  const [rounds, setRounds] = useState<DocumentData[][]>([]);
  const [matches, setMatches] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        const matches = await getMatches();
        const teams = await getTeams();
        setMatches(() => matches);
        setRounds(() => {
          const numOfRounds = Math.ceil(Math.log2(teams.length));
          const rounds: DocumentData[][] = [];
          for (let i = 0; i < numOfRounds; i++) {
            rounds.push([]);
          }
          matches.map((match) => {
            rounds[match.round - 1].push(match);
          });
          return rounds;
        });
      } catch (e) {
        console.error("Error retrieving data: ", e);
      } finally {
        setLoading(false);
      }
    };
    void fetchTournamentData();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <main className="flex h-dvh flex-col items-center-safe gap-20 pt-20">
      <header className={`flex w-screen items-center justify-center`}>
        <h1 className="mx-4 font-header text-6xl font-extrabold underline decoration-red-600 decoration-wavy decoration-4 underline-offset-20">
          Tournament
        </h1>
      </header>
      <Bracket matches={matches} rounds={rounds} />
    </main>
  );
}
