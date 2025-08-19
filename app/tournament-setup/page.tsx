"use client";
import { createTournament } from "@/lib/utils";
import { Skull, Swords, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TournamentSetupPage() {
  const route = useRouter();

  async function handleClick(type: string) {
    try {
      await createTournament(type);
      route.push("/tournament");
    } catch (e) {
      console.error("Error retrieving teams: ", e);
    }
  }

  return (
    <main className="flex h-dvh flex-col items-center gap-20 pt-20">
      <header className={`flex w-screen items-center justify-center`}>
        <h1 className="mx-4 font-header text-6xl font-extrabold underline decoration-red-600 decoration-wavy decoration-4 underline-offset-20">
          Tournament Setup
        </h1>
      </header>
      <section className="flex flex-col items-stretch justify-center gap-5 text-start">
        <button
          onClick={() => handleClick("elimination")}
          className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-accent/50"
        >
          Single Elimination
          <Skull className="ml-2 text-red-600" size={30} strokeWidth={2} />
        </button>
        <button
          // onClick={() => handleClick("group")}
          className="flex cursor-not-allowed items-center justify-between gap-2 rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-accent/50"
        >
          Group Stage + Playoffs
          <Swords className="ml-2 text-red-600" size={30} strokeWidth={2} />
        </button>
        <button
          // onClick={() => handleClick("yves")}
          className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-accent/50"
        >
          Full Round Robin + Playoffs
          <br />
          (the Yves)
          <ScrollText className="ml-2 text-red-600" size={30} strokeWidth={2} />
        </button>
      </section>
    </main>
  );
}
