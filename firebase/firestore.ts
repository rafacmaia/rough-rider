/* === Imports === */
import {
  collection,
  setDoc,
  doc,
  getDocs,
  getCountFromServer,
  query,
  where,
  getDoc,
  updateDoc,
  increment,
  addDoc,
} from "firebase/firestore";
import { db } from "./config";
import players from "./seed-data";
import { random } from "nanoid";

/* === Utility Functions === */
export function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function addPlayers(players: string[]) {
  for (const player of players) {
    try {
      await addDoc(collection(db, "players"), {
        name: player,
        score: 0,
      });
    } catch (e) {
      console.error("Error adding players to database: ", e);
    }
  }
}

// await addPlayers(players);

/* === DB Interactions === */

/* == Adding == */
export async function addTeams(teams: string[][]) {
  let teamCount = 1;
  for (const team of teams) {
    try {
      await setDoc(doc(db, "teams", String(teamCount)), {
        id: teamCount++,
        player1: { name: team[0], score: 0 },
        player2: { name: team[1], score: 0 },
        wins: 0,
        losses: 0,
        plays: 0,
        status: "competing",
      });
    } catch (e) {
      console.error("Error adding teams to database: ", e);
    }
  }
}

export async function createTournament(type: string) {
  try {
    const teams = await getTeams();
    const shuffledTeams = shuffleArray(teams);
    const numOfRounds = Math.ceil(Math.log2(shuffledTeams.length));

    let matchId = 1,
      byeCount = 1;
    let numOfAdvancingTeams = shuffledTeams.length;
    for (let i = 0; i < numOfRounds; i++) {
      const numOfMatches = Math.floor(numOfAdvancingTeams / 2);
      const bye = numOfAdvancingTeams % 2;
      numOfAdvancingTeams = Math.ceil(numOfAdvancingTeams / 2);
      for (let j = 0; j < numOfMatches + bye; j++) {
        const isBye = j === numOfMatches;
        if (isBye) {
          await setDoc(doc(db, "matches", String("b" + byeCount)), {
            byeNum: byeCount++,
            round: i + 1,
            bye: true,
            team1: shuffledTeams[0] ?? null,
            team2: null,
          });
          if (shuffledTeams.length === 1) {
            await updateDoc(doc(db, "teams", String(shuffledTeams[0].id)), {
              status: "bye-advanced",
            });
          }
        } else {
          await setDoc(doc(db, "matches", String(matchId)), {
            matchNum: matchId++,
            round: i + 1,
            bye: false,
            team1: shuffledTeams.shift() ?? null,
            team2: shuffledTeams.shift() ?? null,
            status: "pending",
          });
        }
      }
    }
  } catch (e) {
    console.error("Error retrieving teams: ", e);
  }
}

/* === Get Functions === */
export async function getActiveTournament() {
  try {
    const tournament = await getDocs(
      query(collection(db, "tournaments"), where("status", "==", "active")),
    );

    if (tournament.empty) {
      return null;
    }
    if (tournament.docs.length > 1) {
      throw new Error("More than one active tournament");
    }
    return tournament.docs[0];
  } catch (e) {
    console.error("Error retrieving tournament: ", e);
    return null;
  }
}

export async function getTeams() {
  try {
    const teams = await getDocs(collection(db, "teams"));
    return teams.docs.map((doc) => {
      return doc.data() as Team;
    });
  } catch (e) {
    console.error("Error retrieving teams: ", e);
    return [];
  }
}

export async function getMatches() {
  try {
    const matches = await getDocs(collection(db, "matches"));
    return matches.docs.map((doc) => doc.data());
  } catch (e) {
    console.error("Error retrieving matches: ", e);
    return [];
  }
}

export async function getMatch(matchNum: number) {
  try {
    const match = await getDoc(doc(db, "matches", String(matchNum)));
    return {
      id: matchNum,
      ...match.data(),
    };
  } catch (e) {
    console.error("Error retrieving match: ", e);
  }
}

/* === Update Function === */

// update match scores, team score, and player score
export async function updateMatch(id: number, scores: number[][]) {
  const winningTeam = scores[0][0] + scores[0][1] === 2 ? "team1" : "team2";
  try {
    const matchRef = doc(db, "matches", String(id));

    await updateDoc(matchRef, {
      winner: winningTeam,
      scores: {
        team1: scores[0][0] + scores[0][1],
        team2: scores[1][0] + scores[1][1],
      },
      "team1.player1.score": scores[0][0],
      "team1.player2.score": scores[0][1],
      "team2.player1.score": scores[1][0],
      "team2.player2.score": scores[1][1],
      status: "complete",
    });

    const match = await getDoc(matchRef);
    if (!match.exists()) {
      throw new Error("Match does not exist");
      return;
    }
    const teamRef1 = doc(db, "teams", String(match.data().team1.id));
    const teamRef2 = doc(db, "teams", String(match.data().team2.id));
    await updateDoc(teamRef1, {
      plays: increment(1),
      ...(winningTeam === "team1"
        ? { wins: increment(1), status: "active" }
        : { losses: increment(1), status: "eliminated" }),
    });
    await updateDoc(teamRef2, {
      plays: increment(1),
      ...(winningTeam === "team2"
        ? { wins: increment(1), status: "active" }
        : { losses: increment(1), status: "eliminated" }),
    });

    await updatePlayerScore(match.data().team1.player1.name, scores[0][0]);
    await updatePlayerScore(match.data().team1.player2.name, scores[0][1]);
    await updatePlayerScore(match.data().team2.player1.name, scores[1][0]);
    await updatePlayerScore(match.data().team2.player2.name, scores[1][1]);

    await updateTournament(id);
  } catch (e) {
    console.error("Error updating match: ", e);
  }
}

interface Team {
  id: number;
  player1: { name: string; score: number };
  player2: { name: string; score: number };
  wins: number;
  losses: number;
  plays: number;
  status: string;
}

async function updateTournament(nextMatch: number) {
  console.log("Started updating tournament");
  try {
    const matches = await getMatches();
    const teams = await getTeams();
    const currentRound = matches[nextMatch].round;

    console.log("Current round: ", currentRound);
    console.log("Teams: ", teams);

    if (currentRound > matches[nextMatch - 1].round) {
      const advancingTeams = shuffleArray(
        teams.filter((team) => team.status === "active"),
      );
      console.log("Advancing teams: ", advancingTeams);
      const bye = matches.find(
        (match) => match.round === currentRound && match.bye,
      );
      console.log("Bye: ", bye);
      if (bye) {
        const randomIndex = Math.floor(Math.random() * advancingTeams.length);
        const byeTeam = advancingTeams.splice(randomIndex, 1)[0];
        console.log("Bye team: ", byeTeam);

        const matchRef = doc(db, "matches", String(`b${bye.byeNum}`));
        if (!matchRef) {
          console.error("Match does not exist");
          throw new Error("Match does not exist");
        }
        await updateDoc(matchRef, {
          team1: byeTeam,
        });

        await updateDoc(doc(db, "teams", String(byeTeam.id)), {
          status: "bye-advanced",
        });

        const firstMatchOfNextRound = matches.find(
          (match) => match.round === currentRound + 1,
        );
        console.log("Bye's next match in next round: ", firstMatchOfNextRound);
        if (firstMatchOfNextRound) {
          await updateDoc(
            doc(db, "matches", String(firstMatchOfNextRound.matchNum)),
            {
              team1: byeTeam,
            },
          );
        }
      }

      for (const match of matches) {
        console.log("Writing Match: ", match.matchNum);
        console.log("Advancing teams: ", advancingTeams);
        if (match.round === currentRound && !match.bye) {
          if (match.team1 === null) {
            await updateDoc(doc(db, "matches", String(match.matchNum)), {
              team1: advancingTeams.shift(),
            });
          }
          if (match.team2 === null) {
            await updateDoc(doc(db, "matches", String(match.matchNum)), {
              team2: advancingTeams.shift(),
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("Error retrieving matches: ", e);
  }
}

async function updatePlayerScore(player: string, score: number) {
  const q = query(collection(db, "players"), where("player", "==", player));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.error(`Player ${player} does not exist`);
    return;
  }

  const playerRef = snapshot.docs[0].ref;
  await updateDoc(playerRef, {
    score: increment(score),
  });
}

/* === Helper Function === */
async function addTournament(type: string, numOfRounds: number, teams: any[]) {
  try {
    const tournaments = await getCountFromServer(collection(db, "tournaments"));

    await setDoc(doc(db, "tournaments", String(tournaments.data().count + 1)), {
      rounds: numOfRounds,
      teams: teams,
      status: "active",
    });
  } catch (e) {
    console.error("Error adding tournament to database: ", e);
  }
}
