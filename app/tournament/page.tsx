"use client";
import Bracket from "./_components/Bracket";

export default function TournamentPage() {
  return (
    <main className="flex h-dvh flex-col items-center gap-20 pt-20">
      <header className={`flex w-screen items-center justify-center`}>
        <h1 className="mx-4 font-header text-6xl font-extrabold underline decoration-red-600 decoration-wavy decoration-4 underline-offset-20">
          Tournament
        </h1>
      </header>
      <Bracket />
    </main>
  );
}
