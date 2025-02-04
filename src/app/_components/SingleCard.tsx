import React from "react";

interface SingleCardProps {
  card: { id: number; value: string; isFlipped: boolean };
  onClick: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""}`}
      onClick={onClick}
    >
      {card.isFlipped ? card.value : "?"}
    </div>
  );
};

export default SingleCard;
