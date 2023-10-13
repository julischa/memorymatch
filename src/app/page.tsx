import React, { useState, useEffect } from 'react';
import { useClient } from 'next/react'; // Import useClient
import styles from './page.module.css';

export default function Home() {
  const client = useClient(); // Use the useClient function
  const [cards, setCards] = useState([]); // Represents your game cards
  const [selectedCards, setSelectedCards] = useState([]);
  const [isMatch, setIsMatch] = useState(false);

  // Create a function to shuffle and initialize the cards (you can expand this)
  const initializeGame = () => {
    // Implement your card initialization logic here
    // For example, create an array of card objects with IDs and content
    const newCards = [
      { id: 1, content: 'A' },
      { id: 2, content: 'A' },
      { id: 3, content: 'B' },
      { id: 4, content: 'B' },
      // Add more cards as needed
    ];

    // Shuffle the cards (you can use a shuffle function)
    shuffleArray(newCards);

    setCards(newCards);
    setSelectedCards([]);
  };

  // Function to handle card clicks
  const handleCardClick = (card) => {
    if (selectedCards.length < 2 && !selectedCards.includes(card) && !isMatch) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  // Effect to check for card matches
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [card1, card2] = selectedCards;
      if (card1.content === card2.content) {
        setIsMatch(true);
      } else {
        setIsMatch(false);
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000); // Delay before flipping the unmatched cards
      }
    }
  }, [selectedCards]);

  // Initialize the game on page load
  useEffect(() => {
    initializeGame();
  }, []);

  // Render the cards in your game
  const renderCards = cards.map((card) => (
    <div
      key={card.id}
      className={`${styles.card} ${selectedCards.includes(card) ? styles.selected : ''}`}
      onClick={() => handleCardClick(card)}
    >
      {selectedCards.includes(card) || isMatch ? card.content : 'Card Back'}
    </div>
  ));

  return (
    <main className={styles.main}>
      <div className={styles.description}>Memory Match Game</div>
      <div className={styles.game}>
        {renderCards}
      </div>
      <button onClick={initializeGame}>Restart</button>
    </main>
  );
}

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
