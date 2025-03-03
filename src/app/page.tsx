"use client";
import { useState, useEffect } from "react";
import SingleCard from "./_components/SingleCard";
import { db } from "./lib/firebase/firestore";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const difficulties = {
  easy: 6,
  medium: 12,
  hard: 16,
};

const generateCards = (pairCount: number) => {
  const selectedImages = Array.from({ length: pairCount }, (_, i) => ({
    id: i + 1,
    value: `/images/${i + 1}.png`,
    isFlipped: false,
    isMatched: false,
    isShaking: false,
  }));

  return [...selectedImages, ...selectedImages].map((card, index) => ({
    ...card,
    id: index + 1,
  }));
};

const Page: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [cards, setCards] = useState<{ id: number; value: string; isFlipped: boolean; isMatched: boolean; isShaking: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [extraScore, setExtraScore] = useState(0);
  const [gameName, setGameName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [goButtonZoom, setGoButtonZoom] = useState(false);
  const [firstEntry, setFirstEntry] = useState(true);

  useEffect(() => {
    if (difficulty) {
      const newCards = generateCards(difficulties[difficulty]);
      setCards(newCards.sort(() => Math.random() - 0.5));
    }
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isGameRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsGameRunning(false);
      const finalScore = score + Math.max(0, 100 - timeElapsed);
      setExtraScore(finalScore);

      if (gameName) {
        addDoc(collection(db, "leaderboard"), {
          name: gameName,
          score: finalScore,
          timestamp: new Date(),
        });
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameRunning, cards]);

  useEffect(() => {
    if (typeof window !== "undefined" && cards.length > 0 && cards.every((card) => card.isMatched)) {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti();
      });
    }
  }, [cards]);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scores = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        score: doc.data().score,
      }));
      setLeaderboard(scores);
    });

    return () => unsubscribe();
  }, []);

  const handleStartGame = () => {
    if (!gameName || !difficulty) return alert("Please enter your name & select the difficulty");

    if (firstEntry) {
      setGoButtonZoom(true);
      setTimeout(() => {
        setHasStarted(true);
        setScore(0);
        setExtraScore(0);
        setTimeElapsed(0);
        setIsGameRunning(true);
        setFirstEntry(false);
      }, 800);
    } else {
      setHasStarted(true);
      setScore(0);
      setExtraScore(0);
      setTimeElapsed(0);
      setIsGameRunning(true);
    }
  };

  const handleNewGame = () => {
    setDifficulty(null);
    setCards([]);
    setFlippedCards([]);
    setScore(0);
    setExtraScore(0);
    setTimeElapsed(0);
    setIsGameRunning(false);
    setGameName("");
    setHasStarted(false);
    setFirstEntry(true);
    setGoButtonZoom(false);
  };

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length === 2 || cards.find((card) => card.id === id)?.isFlipped) return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );

    setCards(updatedCards);
    const newFlipped = [...flippedCards, id];

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setTimeout(() => {
        setCards((prevCards) => {
          const [firstId, secondId] = newFlipped;
          const firstCard = prevCards.find((card) => card.id === firstId);
          const secondCard = prevCards.find((card) => card.id === secondId);

          if (firstCard && secondCard && firstCard.value === secondCard.value) {
            setScore((prevScore) => prevScore + 10);
            return prevCards.map((card) =>
              card.value === firstCard.value ? { ...card, isMatched: true } : card
            );
          } else {
            const updatedCards = prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isShaking: true }
                : card
            );

            setTimeout(() => {
              setCards((prev) =>
                prev.map((card) =>
                  card.id === firstId || card.id === secondId
                    ? { ...card, isShaking: false, isFlipped: false }
                    : card
                )
              );
            }, 300);

            return updatedCards;
          }
        });

        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    } else {
      setFlippedCards(newFlipped);
    }
  };

  return (
    <>
      <div className="leaderboard-container">
        <div className="leaderboard">
          {leaderboard.map((entry, index) => (
            <span key={index} className="leaderboard-item">
              {index + 1}. {entry.name} – {entry.score} Points
            </span>
          ))}
        </div>
      </div>

      {!hasStarted ? (
        <div className="main">
          <div className="main-content">
            <h1 className="title">
              <span>Mouse</span>
              <span>Memory</span>
            </h1>
            <span className="enter-name">ENTER YOUR NAME:</span><br /><br />
            <input className="name-enter"
              type="text"
              placeholder=""
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            /><br /><br />
            <span>CHOOSE YOUR LEVEL:</span>
            <div className="main-buttons">
              <button onClick={() => setDifficulty("easy")}>EASY</button>
              <button onClick={() => setDifficulty("medium")}>MEDIUM</button>
              <button onClick={() => setDifficulty("hard")}>HARD</button>
            </div>
            <br /><br></br>
            <div className="go">
              {firstEntry && (
                <button className={`start-button ${goButtonZoom ? "zoom" : ""}`} onClick={handleStartGame}>
                  GO
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <h2>Let's go, {gameName}!</h2>
          <h3>Score: {score} | Time: {timeElapsed}s</h3>
          <h3>Final Score: {extraScore}</h3>
          <div className={`grid ${difficulty ? difficulty : ""}`}>
            {cards.map((card) => (
              <SingleCard key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
            ))}
          </div>
          <button className="new-game-button" onClick={handleNewGame}>NEW GAME</button>
        </div>
      )}
    </>
  );
};

export default Page;
