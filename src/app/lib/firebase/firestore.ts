import { firebaseApp } from "./firebaseConfig";
import { getFirestore, collection, doc, setDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);


const leaderboardRef = collection(db, "leaderboard");


const saveScore = async (playerName: string, score: number) => {
  try {
    const newScoreRef = doc(leaderboardRef);
    await setDoc(newScoreRef, {
      playerName,
      score,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving score:", error);
  }
};


const getTopScores = async () => {
  try {
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching top scores:", error);
    return [];
  }
};

export { db, saveScore, getTopScores };
