import React from "react";
import "../globals.css";

interface CardProps {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface SingleCardProps {
  card: CardProps;
  onClick: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({ card, onClick }) => {
  return (
    <div className={`card ${card.isFlipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="cardInner">
        <div className="cardFront">
          {!card.isFlipped ? (
            <img src="/images/back.png" alt="Card Back" className="cardImage" />
          ) : (
            <img src={card.value} alt="Memory Card" className="cardImage" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
