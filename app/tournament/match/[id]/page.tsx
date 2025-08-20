"use client";
import { use, useEffect, useState } from "react";
import { ArrowBigRight, X } from "lucide-react";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMatch, updateMatch } from "@fb/firestore";
import BeerCan from "@/public/beer-can-icon.svg";
import BeerCanCrushed from "@/public/beer-can-crushed-icon.svg";
import Dart from "@/public/dart-icon.svg";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

type Team = {
  teamNum: number;
  player1: DocumentData;
  player2: DocumentData;
};

export default function MatchPage({ params }: MatchPageProps) {
  const [match, setMatch] = useState<DocumentData>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scoringTeam, setScoringTeam] = useState<Team | null>(null);
  const [matchOver, setMatchOver] = useState<boolean>(false);
  const [scores, setScores] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [crushedCans, setCrushedCans] = useState<boolean[][]>([
    [false, false],
    [false, false],
  ]);
  const resolvedParams = use(params);
  const matchId = Number(resolvedParams.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const match = await getMatch(matchId);
        setMatch(() => {
          return match;
        });
      } catch (e) {
        console.error("Error retrieving data: ", e);
      }
    };
    fetchData().then(() => setLoading(false));
  }, [matchId]);

  const updateScores = (team: number, player: number) => {
    let scoresTemp: number[][] = [
      ...scores.map((teamScores) => [...teamScores]),
    ];
    scoresTemp[team - 1][player - 1] += 1;
    setScores(scoresTemp);
    setIsModalOpen(false);

    if (
      (crushedCans[0][0] && crushedCans[0][1]) ||
      (crushedCans[1][0] && crushedCans[1][1])
    ) {
      endMatch();
    }
  };

  const endMatch = () => {
    setMatchOver(true);
  };

  const updateCans = (team: number, player: number) => {
    let crushedCansTemp: boolean[][] = [
      ...crushedCans.map((teamCans) => [...teamCans]),
    ];
    crushedCansTemp[team - 1][player - 1] = true;
    return setCrushedCans(crushedCansTemp);
  };

  const handleCanCrush = (crushedTeam: number, crushedPlayer: number) => {
    updateCans(crushedTeam, crushedPlayer);
    crushedTeam === 1
      ? updateScoringTeam(match.team2, 2)
      : updateScoringTeam(match.team1, 1);
    setIsModalOpen(true);
  };

  const updateScoringTeam = (team: DocumentData, scoringTeam: number) => {
    setScoringTeam({
      teamNum: scoringTeam,
      player1: team.player1,
      player2: team.player2,
    });
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-12">
        <div className="text-center font-header text-xl font-extrabold tracking-wide">
          <h3 className="border-b-2 border-red-600 p-1">LOADING...</h3>
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className={`pt-20 text-center`}>
        <h1 className="font-header text-6xl font-extrabold underline decoration-red-600 decoration-wavy decoration-4 underline-offset-20">
          {String("Match " + match.id)}
        </h1>
      </header>
      <main className="flex w-screen grow items-center justify-center pb-6">
        <section className="flex grow items-center justify-evenly px-0 py-6 text-center">
          <TeamDisplay
            team={match.team1}
            teamNum={1}
            onCanCrush={handleCanCrush}
            crushedCans={crushedCans[0]}
            scores={scores[0]}
          />
          <X className="text-red-600" size={55} />
          {/*<hr className="fixed w-[400px] rotate-90 border-b-1 border-red-600/60" />*/}
          <TeamDisplay
            team={match.team2}
            teamNum={2}
            onCanCrush={handleCanCrush}
            crushedCans={crushedCans[1]}
            scores={scores[1]}
          />
        </section>

        <ScoringModal
          isOpen={isModalOpen}
          scoringTeam={scoringTeam}
          handleScoring={updateScores}
        />

        <EndMatchModal isOpen={matchOver} match={match} scores={scores} />
      </main>
    </div>
  );
}

interface TeamDisplayProps {
  team: DocumentData;
  teamNum: number;
  onCanCrush: (team: number, player: number) => void;
  crushedCans: boolean[];
  scores: number[];
}

function TeamDisplay({
  team,
  teamNum,
  onCanCrush,
  crushedCans,
  scores,
}: TeamDisplayProps) {
  return (
    <div
      className={`relative flex w-xs flex-col items-center justify-center gap-20 truncate overflow-hidden rounded-xl border-5 border-black bg-yellow-300/85 px-2 py-8 font-footer text-[2.7rem] font-bold text-nowrap`}
    >
      <div className="flex min-w-4/5 flex-col items-center justify-between px-6">
        {team.player1.name}
        {scores[0] > 0 && (
          <Image
            src={Dart}
            alt="dart"
            className={`absolute size-10 ${teamNum === 1 ? "top-25 right-7 rotate-0" : "top-25 left-7 rotate-90"}`}
          />
        )}
        {scores[0] > 1 && (
          <Image
            src={Dart}
            alt="dart"
            className={`absolute size-10 ${teamNum === 1 ? "top-25 right-18 rotate-0" : "top-25 left-18 rotate-90"}`}
          />
        )}
        <button
          disabled={crushedCans[0]}
          onClick={() => onCanCrush(teamNum, 1)}
          className={`relative mt-8 shrink-0 border-none bg-transparent focus:ring-0 focus:outline-none ${crushedCans[0] ? "h-[90px] w-[47px] opacity-70" : "h-[90px] w-[45px] cursor-pointer"}`}
        >
          <Image
            className="absolute bottom-0"
            src={crushedCans[0] ? BeerCanCrushed : BeerCan}
            alt="Beer can icon. Shown crushed if the can has been pierced."
          />
        </button>
      </div>
      {/*<hr className="w-[80%] border-b-1 border-black/40" />*/}
      <div className="flex min-w-4/5 flex-col items-center px-6">
        <button
          disabled={crushedCans[1]}
          onClick={() => onCanCrush(teamNum, 2)}
          className={`relative mb-8 shrink-0 border-none bg-transparent focus:ring-0 focus:outline-none ${crushedCans[1] ? "h-[100px] w-[47px] opacity-70" : "h-[100px] w-[45px] cursor-pointer"}`}
        >
          {/*{crushedCans[1] && (*/}
          {/*  <X className="absolute -right-3 bottom-0 text-black" size={70} />*/}
          {/*)}*/}
          <Image
            className="absolute bottom-0"
            src={crushedCans[1] ? BeerCanCrushed : BeerCan}
            alt="beer can"
          />
        </button>
        {team.player2.name}
        {scores[1] > 0 && (
          <Image
            src={Dart}
            alt="dart"
            className={`absolute size-10 ${teamNum === 1 ? "right-7 bottom-25 rotate-270" : "bottom-25 left-7 rotate-180"}`}
          />
        )}
        {scores[1] > 1 && (
          <Image
            src={Dart}
            alt="dart"
            className={`absolute size-10 ${teamNum === 1 ? "right-18 bottom-25 rotate-270" : "bottom-25 left-18 rotate-180"}`}
          />
        )}
      </div>
    </div>
  );
}

function ScoringModal({ isOpen, scoringTeam, handleScoring }: any) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="flex flex-col items-center justify-center gap-12 rounded-lg border-6 border-black bg-background p-12">
        <h1 className="font-header text-6xl font-black tracking-wide">
          Who scored?
        </h1>
        <div className="flex w-full items-center justify-center gap-12">
          <button
            onClick={() => handleScoring(scoringTeam.teamNum, 1)}
            className="cursor-pointer rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-accent/30"
          >
            {scoringTeam.player1.name}
          </button>
          <button
            onClick={() => handleScoring(scoringTeam.teamNum, 2)}
            className="cursor-pointer rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-accent/30"
          >
            {scoringTeam.player2.name}
          </button>
        </div>
      </div>
    </div>
  );
}

interface EndMatchModalProps {
  isOpen: boolean;
  match: DocumentData;
  scores: number[][];
}

function EndMatchModal({ isOpen, match, scores }: EndMatchModalProps) {
  if (!isOpen) {
    return null;
  }

  const route = useRouter();
  const winningTeam =
    scores[0][0] + scores[0][1] === 2 ? match.team1 : match.team2;

  const handleMatchEnd = async () => {
    try {
      await updateMatch(match.id, scores);
      route.push("/tournament");
    } catch (e) {
      console.error("Error updating match: ", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="flex flex-col items-center justify-center rounded-lg border-6 border-black bg-background p-12">
        <h1 className="mb-16 font-header text-6xl font-black tracking-wide underline decoration-red-600 decoration-wavy decoration-4 underline-offset-15">
          Final Score
        </h1>

        <div className="mb-10 flex flex-col items-center justify-center text-center font-footer text-2xl leading-relaxed">
          <div className="flex w-full items-center justify-center gap-6">
            <div
              className={`w-[13rem] overflow-hidden rounded-xl bg-accent p-4 px-6 font-black text-nowrap ${scores[0][0] + scores[0][1] === 2 ? "border-6 border-double border-red-600" : "border-3"}`}
            >
              {match.team1.player1.name}:
              <span className="ml-2 text-red-600">{scores[0][0]}</span>
              <hr className="mx-auto my-1 w-4/5 border-b-1 border-black/40" />
              {match.team1.player2.name}:
              <span className="ml-2 text-red-600">{scores[0][1]}</span>
            </div>
            <X className="mx-2 text-red-600/75" size={26} strokeWidth={3} />
            <div
              className={`w-[13rem] overflow-hidden rounded-xl bg-accent p-4 px-6 font-black text-nowrap ${scores[1][0] + scores[1][1] === 2 ? "border-6 border-double border-red-600" : "border-3"}`}
            >
              {match.team2.player1.name}:
              <span className="ml-2 text-red-600">{scores[1][0]}</span>
              <hr className="mx-auto my-1 w-4/5 border-b-1 border-black/40" />
              {match.team2.player2.name}:
              <span className="ml-2 text-red-600">{scores[1][1]}</span>
            </div>
          </div>
          <h2 className={`mt-10 font-header text-3xl font-black`}>
            Winners :{" "}
            <span className={`ml-2`}>
              {winningTeam.player1.name} & {winningTeam.player2.name}
            </span>
          </h2>
        </div>
        <button
          onClick={handleMatchEnd}
          className="flex cursor-pointer items-center rounded-xl border-3 bg-accent p-4 px-6 text-center font-footer text-3xl font-semibold hover:bg-black hover:text-yellow-300"
        >
          Back to tournament
          <ArrowBigRight size={26} className="ml-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
