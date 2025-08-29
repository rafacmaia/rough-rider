import BeerCanCrushed from "@/public/beer-can-crushed-icon.svg";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <Image
        className="fixed size-18 -translate-y-18 opacity-75"
        src={BeerCanCrushed}
        alt="Beer can icon. Shown crushed if the can has been pierced."
      />
      <h3 className="p-1 text-center font-header text-2xl font-extrabold tracking-[0.15em] text-slate-900/90 underline decoration-red-600/70 decoration-wavy decoration-[2.5px] underline-offset-8">
        Loading...
      </h3>
    </main>
  );
}
