import "./App.css";

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [firstChoice, setFirstChoice] = useState<Card | null>(null);
  const [secondChoice, setSecondChoice] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [passedTime, setPassedTime] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [showStartModal, setShowStartModal] = useState<boolean>(false);
  const handleCloseStartModal = () => setShowStartModal(false);
  const handleShowStartModal = () => setShowStartModal(true);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const handleCloseTutorialModal = () => setShowTutorialModal(false);
  const handleShowTutorialModal = () => setShowTutorialModal(true);
  const [difficulty, setDifficulty] = useState<string>("medium");

  interface Card {
    name: string;
    src: string;
    match: boolean;
    id: number;
  }

  interface HighScore {
    id: string;
    player: string;
    score: number;
  }

  const easyCards: Card[] = [
    { name: "Card1", src: Card1, match: false, id: 0 },
    { name: "Card2", src: Card2, match: false, id: 1 },
    { name: "Card3", src: Card3, match: false, id: 2 },
    { name: "Card5", src: Card5, match: false, id: 3 },
    { name: "Card6", src: Card6, match: false, id: 4 },
    { name: "Card8", src: Card8, match: false, id: 5 },
  ];

  const mediumCards: Card[] = [
    { name: "Card1", src: Card1, match: false, id: 0 },
    { name: "Card2", src: Card2, match: false, id: 1 },
    { name: "Card3", src: Card3, match: false, id: 2 },
    { name: "Card4", src: Card4, match: false, id: 3 },
    { name: "Card5", src: Card5, match: false, id: 4 },
    { name: "Card6", src: Card6, match: false, id: 5 },
    { name: "Card7", src: Card7, match: false, id: 6 },
    { name: "Card8", src: Card8, match: false, id: 7 },
  ];

  const hardCards: Card[] = [
    { name: "Card1", src: Card1, match: false, id: 0 },
    { name: "Card2", src: Card2, match: false, id: 1 },
    { name: "Card3", src: Card3, match: false, id: 2 },
    { name: "Card4", src: Card4, match: false, id: 3 },
    { name: "Card5", src: Card5, match: false, id: 4 },
    { name: "Card6", src: Card6, match: false, id: 5 },
    { name: "Card7", src: Card7, match: false, id: 6 },
    { name: "Card8", src: Card8, match: false, id: 7 },
    { name: "Card9", src: Card9, match: false, id: 8 },
    { name: "Card10", src: Card10, match: false, id: 9 },
  ];

  // duplicate & shuffle cards and start a game
  const shuffleCards = () => {
    let cardsToUse: Card[];
    if (difficulty === "easy") {
      cardsToUse = easyCards;
    } else if (difficulty === "medium") {
      cardsToUse = mediumCards;
    } else {
      cardsToUse = hardCards;
    }

    const shuffledCards = [...cardsToUse, ...cardsToUse]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setStartTime(Date.now());
    setEndTime(null);
    setPassedTime(0);
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setTurns(0);
    setInputValue("");
  };

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        setPassedTime((prevPassedTime) => prevPassedTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  // end game
  useEffect(() => {
    let startingPoint: number;
    if (difficulty === "easy") {
      startingPoint = 6000;
    } else if (difficulty === "medium") {
      startingPoint = 10000;
    } else {
      startingPoint = 14000;
    }

    if (cards.length > 0 && cards.every((card) => card.match)) {
      handleShowModal();
      setEndTime(Date.now());
      const randomValue = Math.round(Math.random
