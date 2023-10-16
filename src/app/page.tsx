import React, { useState, useEffect } from 'react';
import { useClient } from 'next/react'; // Import useClient
import styles from './page.module.css';

export default function Home() {
  const client = useClient(); 
  const [cards, setCards] = useState([]); 
  const [selectedCards, setSelectedCards] = useState([]);
  const [isMatch, setIsMatch] = useState(false);


  const initializeGame = () => {
    const newCards = [
      { id: 1, content: 'A' },
      { id: 2, content: 'A' },
      { id: 3, content: 'B' },
      { id: 4, content: 'B' },
      
    ];


    shuffleArray(newCards);

    setCards(newCards);
    setSelectedCards([]);
  };

 
  const handleCardClick = (card) => {
    if (selectedCards.length < 2 && !selectedCards.includes(card) && !isMatch) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [card1, card2] = selectedCards;
      if (card1.content === card2.content) {
        setIsMatch(true);
      } else {
        setIsMatch(false);
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000); 
      }
    }
  }, [selectedCards]);

  
  useEffect(() => {
    initializeGame();
  }, []);


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


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
