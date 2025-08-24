import { DocumentData } from "@firebase/firestore";
import { Beer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";

interface BracketProps {
  matches: DocumentData[];
  rounds: DocumentData[][];
}

export default function Bracket({ matches, rounds }: BracketProps) {
  const nextMatch = matches.find((match) => match.status === "pending");
  const currentRound = nextMatch ? nextMatch.round : -1;
  const roundElements = rounds.map((round, i) => {
    return (
      <Round
        key={i}
        round={round}
        roundNum={i + 1}
        currentRound={currentRound}
      />
    );
  });

  return (
    <section className="flex flex-col items-center justify-center">
      {roundElements}
    </section>
  );
}

interface RoundProps {
  round: DocumentData[];
  roundNum: number;
  currentRound: number;
}

function Round({ round, roundNum, currentRound }: RoundProps) {
  const matchElements = round.map((match, j) => {
    return <Match key={j} match={match} />;
  });

  return (
    <div
      className={`flex w-screen items-center-safe justify-center-safe border-b-3 border-black px-20 py-10 ${roundNum === 1 && "border-t-3"} ${roundNum === currentRound ? "bg-slate-800 text-yellow-300" : "bg-background text-black"}`}
    >
      <h2 className={`w-1/12 font-header text-6xl`}>{roundNum}</h2>
      <div className="flex grow items-center justify-center gap-12 text-black">
        {matchElements}
      </div>
    </div>
  );
}

interface MatchProps {
  match: DocumentData;
}

function Match({ match }: MatchProps) {
  const router = useRouter();

  function handleNavigation(matchNum: number) {
    router.push(`/tournament/match/${matchNum}`);
  }

  if (match.bye) {
    return (
      <div className="relative flex h-26 w-[14rem] items-center justify-around gap-2 rounded-lg border-4 border-black bg-blue-300 px-6 py-3 text-center font-footer text-[1.5rem] font-black tracking-wide">
        {match.team1 ? (
          <div className="w-full truncate overflow-hidden leading-relaxed text-nowrap">
            {match.team1.player1.name}
            <hr className="m-auto w-6/7 border-b-1 border-black/40" />
            {match.team1.player2.name}
          </div>
        ) : (
          <Beer className="w-3/7 text-red-950" size={44} strokeWidth={1} />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-26 w-sm items-center justify-center rounded-lg border-4 px-3 py-3 text-center font-footer text-[1.5rem] font-black ${match.status === "complete" ? "border-black bg-accent/80" : "border-black bg-yellow-300"}`}
    >
      <div className={`absolute -top-0 left-1 text-base`}>{match.matchNum}</div>
      {match.status === "pending" && match.team1 && match.team2 && (
        <button
          onClick={() => {
            handleNavigation(match.matchNum);
          }}
          className="absolute inset-0 z-[999] size-full cursor-pointer bg-transparent"
        ></button>
      )}
      {!match.team1 ? (
        <Beer className="w-3/7 text-red-600" size={44} strokeWidth={1} />
      ) : (
        <div
          className={`w-3/7 leading-relaxed text-nowrap ${match.winner !== "team1" && match.status === "complete" && "opacity-50"}`}
        >
          {match.team1.player1.name}
          {match.status === "complete" && (
            <span className={`ml-2 text-red-600`}>
              {match.team1.player1.score}
            </span>
          )}
          <hr className={`m-auto w-6/7 border-b-1 border-black/40`} />
          {match.team1.player2.name}
          {match.status === "complete" && (
            <span className={`ml-2 text-red-600`}>
              {match.team1.player2.score}
            </span>
          )}
        </div>
      )}
      <X
        className={`mx-2 text-red-600 ${match.status == "complete" && "opacity-30"}`}
        size={36}
        strokeWidth={3}
      />
      {!match.team2 ? (
        <Beer className="w-3/7 text-red-600" size={44} strokeWidth={1} />
      ) : (
        <div
          className={`w-3/7 leading-relaxed text-nowrap ${match.winner !== "team2" && match.status === "complete" && "opacity-30"}`}
        >
          {match.team2?.player1.name}
          {match.status === "complete" && (
            <span className={`ml-2 text-red-600`}>
              {match.team2.player1.score}
            </span>
          )}
          <hr className={`m-auto w-5/7 border-b-1 border-black/40`} />
          {match.team2?.player2.name}
          {match.status === "complete" && (
            <span className={`ml-2 text-red-600`}>
              {match.team2.player2.score}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
