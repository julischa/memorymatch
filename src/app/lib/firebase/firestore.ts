import { db } from "./firebaseConfig";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

export const saveScore = async (name: string, score: number, difficulty: string) => {
  try {
    await addDoc(collection(db, "scores"), {
      name,
      score,
      difficulty,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving score:", error);
  }
};

export const fetchScores = async () => {
  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

export { db };
