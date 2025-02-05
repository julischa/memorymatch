interface CardProps {
  id: number;
  value: string;
  isFlipped: boolean;
}

interface SingleCardProps {
  card: CardProps;
  onClick: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({ card, onClick }) => {
  return (
    <div 
      className={`card ${card.isFlipped ? "flipped" : ""}`} 
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">
          <img src={card.value} alt="Memory Card" />
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
