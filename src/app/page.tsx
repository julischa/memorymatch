"use client";
import { useState, useEffect } from "react";
import SingleCard from "./_components/SingleCard";

const difficulties = {
  easy: 6,
  medium: 12,
  hard: 18,
};

const generateCards = (pairCount: number) => {
  const selectedImages = Array.from({ length: pairCount }, (_, i) => ({
    id: i + 1,
    value: `/images/${i + 1}.png`,
    isFlipped: false,
    isMatched: false,
  }));

  return [...selectedImages, ...selectedImages]
    .map((card, index) => ({ ...card, id: index + 1 }))
    .sort(() => Math.random() - 0.5);
};

const Page: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [cards, setCards] = useState<{ id: number; value: string; isFlipped: boolean; isMatched: boolean }[]>([]);
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
      setCards(generateCards(difficulties[difficulty]));
    }
  }, [difficulty, isClient]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti();
      });
    }
  }, [cards]);

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

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.value === firstCard.value ? { ...card, isMatched: true } : card
          )
        );
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === flippedCards[0] || card.id === id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      setFlippedCards([]);
    }
  };

  if (!isClient) return <></>;

  return (
    <>
      {!hasStarted ? (
        <div className="main">
          <div className="main-content">
            <h1>Mouse Memory</h1>
            <input
              type="text"
              placeholder="Enter your name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
            <div className="main-buttons">
              <button onClick={() => setDifficulty("easy")}>Easy</button>
              <button onClick={() => setDifficulty("medium")}>Medium</button>
              <button onClick={() => setDifficulty("hard")}>Hard</button>
            </div>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <h2>Welcome, {gameName}!</h2>
          <h3>Score: {score}</h3>
          <button onClick={handleNewGame}>New Game</button>
          <div className={`grid ${difficulty ? difficulty : ""}`}>
            {cards.map((card) => (
              <SingleCard key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
