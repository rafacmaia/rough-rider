import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-12">
      <h1 className="font-header text-6xl font-extrabold tracking-wide">
        Rough Riders
      </h1>
      <Link
        href="./teams"
        className="w-76 cursor-pointer rounded-xl border-3 bg-accent p-4 text-center font-footer text-2xl font-semibold hover:bg-accent/50"
      >
        Start New Tournament
      </Link>
    </main>
  );
}
