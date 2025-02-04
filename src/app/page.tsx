"use client";

import { useState } from "react";
import SingleCard from "./_components/SingleCard";
import Layout from "./Layout"

const initialCards = [
  { id: 1, value: "🍎", isFlipped: false },
  { id: 2, value: "🍎", isFlipped: false },
  { id: 3, value: "🍌", isFlipped: false },
  { id: 4, value: "🍌", isFlipped: false },
  { id: 5, value: "🍇", isFlipped: false },
  { id: 6, value: "🍇", isFlipped: false },
  { id: 7, value: "🍉", isFlipped: false },
  { id: 8, value: "🍉", isFlipped: false },
  { id: 9, value: "🥝", isFlipped: false },
  { id: 10, value: "🥝", isFlipped: false },
  { id: 11, value: "🍍", isFlipped: false },
  { id: 12, value: "🍍", isFlipped: false },
];

const Page: React.FC = () => {
  const [cards, setCards] = useState(initialCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameName, setGameName] = useState("");

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

      if (firstCard?.value === secondCard?.value) {
        setScore(score + 1);
      } else {
        setTimeout(() => {
          setCards(
            cards.map((card) =>
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

  return (
    <Layout>
      <div>
        <input
          type="text"
          placeholder="Enter your game name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <h2>Score: {score}</h2>
        <div className="grid">
          {cards.map((card) => (
            <SingleCard key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
