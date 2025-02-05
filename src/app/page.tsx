"use client";
import { useState, useEffect } from "react";
import SingleCard from "./_components/SingleCard";
import styles from "./page.module.css";


const emojis = ["🍎", "🍌", "🍇", "🍉", "🥝", "🍍", "🍒", "🍑", "🍋", "🍊", "🥥", "🍓", "🫐", "🥭", "🌰", "🌽", "🥕", "🥒"];

const difficulties = {
  easy: 6,
  medium: 12,
  hard: 18,
};

const generateCards = (pairCount: number) => {
  const selectedEmojis = emojis.slice(0, pairCount)
  return [...selectedEmojis, ...selectedEmojis]
    .map((value, index) => ({ id: index + 1, value, isFlipped: false }))
    .sort(() => Math.random() - 0.5);
};

const Page: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [cards, setCards] = useState<{ id: number; value: string; isFlipped: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameName, setGameName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
  if (difficulty && isClient) {
    setCards(() => generateCards(difficulties[difficulty]));
  }
}, [difficulty, isClient]);

  const handleStartGame = () => {
    if (!gameName || !difficulty) return alert("Please enter your name & select the difficulty");
    setHasStarted(true);
  };

  const handleNewGame = () => {
    setDifficulty(null);
    setCards([]);
    setFlippedCards([]);
    setScore(0);
    setGameName("");
    setHasStarted(false);
  };

 if (!isClient) return <></>;

  return (<>
    
      {hasStarted ? (
        <div>
          <h2>Welcome, {gameName}!</h2>
          <h3>Score: {score}</h3>
          <button onClick={handleNewGame}>New Game</button>
          <div className="grid">
            {cards.map((card) => (
              <SingleCard key={card.id} card={card} onClick={() => {}} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1>Mouse Memory</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <div>
            <button onClick={() => setDifficulty("easy")}>Easy</button>
            <button onClick={() => setDifficulty("medium")}>Medium</button>
            <button onClick={() => setDifficulty("hard")}>Hard</button>
          </div>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
    </>
  );
};

export default Page;
