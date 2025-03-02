import "../globals.css";
import { useEffect, useState } from "react";

interface CardProps {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking?: boolean;
}

interface SingleCardProps {
  card: CardProps;
  onClick: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({ card, onClick }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className={`card ${card.isFlipped ? "flipped" : ""} ${card.isShaking ? "shake" : ""}`} onClick={onClick}>
      <div className="cardInner">
        <div className="cardFront">
          <img src="/images/back.png" alt="Card Back" className="cardImage" />
        </div>
        <div className="cardBack">
          <img src={card.value} alt="Memory Card" className="cardImage" />
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
