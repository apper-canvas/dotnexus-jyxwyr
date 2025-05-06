import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Define player colors
const PLAYER_COLORS = [
  'rgb(93, 101, 239)', // primary (blue)
  'rgb(255, 121, 80)', // secondary (orange)
  'rgb(16, 185, 129)',  // accent (green)
  'rgb(168, 85, 247)',  // purple
];

function MainFeature() {
  // Declare icon components
  const RefreshCw = getIcon('RefreshCw');
  const Settings = getIcon('Settings');
  const Trophy = getIcon('Trophy');
  const Users = getIcon('Users');
  const ChevronDown = getIcon('ChevronDown');
  const ChevronUp = getIcon('ChevronUp');
  const Info = getIcon('Info');
  
  // Game state
  const [gridSize, setGridSize] = useState(5);
  const [numPlayers, setNumPlayers] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState(Array(4).fill(0));
  const [grid, setGrid] = useState([]);
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [verticalLines, setVerticalLines] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const canvasRef = useRef(null);
  
  // Initialize or reset the game
  const resetGame = () => {
    // Reset scores
    setScores(Array(numPlayers).fill(0));
    setCurrentPlayer(0);
    
    // Create grid points
    const newGrid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        newGrid.push({ x, y });
      }
    }
    setGrid(newGrid);
    
    // Initialize empty lines
    const newHorizontalLines = [];
    const newVerticalLines = [];
    
    // Add horizontal lines (gridSize rows, gridSize-1 lines per row)
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize - 1; x++) {
        newHorizontalLines.push({
          startX: x,
          startY: y,
          endX: x + 1,
          endY: y,
          drawn: false,
          owner: null
        });
      }
    }
    
    // Add vertical lines (gridSize-1 rows, gridSize lines per row)
    for (let y = 0; y < gridSize - 1; y++) {
      for (let x = 0; x < gridSize; x++) {
        newVerticalLines.push({
          startX: x,
          startY: y,
          endX: x,
          endY: y + 1,
          drawn: false,
          owner: null
        });
      }
    }
    
    setHorizontalLines(newHorizontalLines);
    setVerticalLines(newVerticalLines);
    
    // Initialize empty boxes
    const newBoxes = [];
    for (let y = 0; y < gridSize - 1; y++) {
      for (let x = 0; x < gridSize - 1; x++) {
        newBoxes.push({
          x,
          y,
          complete: false,
          owner: null
        });
      }
    }
    setBoxes(newBoxes);
    
    setGameStarted(true);
    
    toast.success(`Game started with ${numPlayers} players!`, {
      icon: <Users className="w-5 h-5 text-primary" />
    });
  };
  
  // Find line index by coordinates
  const findLineIndex = (lines, startX, startY, endX, endY) => {
    return lines.findIndex(
      line => 
        (line.startX === startX && line.startY === startY && line.endX === endX && line.endY === endY) ||
        (line.startX === endX && line.startY === endY && line.endX === startX && line.endY === startY)
    );
  };
  
  // Check if a box is complete
  const checkBoxComplete = (boxX, boxY) => {
    // Get the indices of the four lines that make up the box
    const topIndex = findLineIndex(horizontalLines, boxX, boxY, boxX + 1, boxY);
    const rightIndex = findLineIndex(verticalLines, boxX + 1, boxY, boxX + 1, boxY + 1);
    const bottomIndex = findLineIndex(horizontalLines, boxX, boxY + 1, boxX + 1, boxY + 1);
    const leftIndex = findLineIndex(verticalLines, boxX, boxY, boxX, boxY + 1);
    
    // Check if all four lines are drawn
    return (
      topIndex !== -1 && horizontalLines[topIndex].drawn &&
      rightIndex !== -1 && verticalLines[rightIndex].drawn &&
      bottomIndex !== -1 && horizontalLines[bottomIndex].drawn &&
      leftIndex !== -1 && verticalLines[leftIndex].drawn
    );
  };
  
  // Handle line click
  const handleLineClick = (isHorizontal, index) => {
    if (!gameStarted) return;
    
    const lines = isHorizontal ? [...horizontalLines] : [...verticalLines];
    
    // If the line is already drawn, do nothing
    if (lines[index].drawn) return;
    
    // Draw the line
    lines[index].drawn = true;
    lines[index].owner = currentPlayer;
    
    if (isHorizontal) {
      setHorizontalLines(lines);
    } else {
      setVerticalLines(lines);
    }
    
    // Check if any boxes were completed by this move
    let boxCompleted = false;
    const newBoxes = [...boxes];
    
    for (let i = 0; i < newBoxes.length; i++) {
      const box = newBoxes[i];
      
      if (!box.complete && checkBoxComplete(box.x, box.y)) {
        box.complete = true;
        box.owner = currentPlayer;
        boxCompleted = true;
        
        // Update score
        const newScores = [...scores];
        newScores[currentPlayer]++;
        setScores(newScores);
      }
    }
    
    setBoxes(newBoxes);
    
    // Check if game is over
    const allBoxesComplete = newBoxes.every(box => box.complete);
    if (allBoxesComplete) {
      // Find winner
      let maxScore = -1;
      let winners = [];
      
      for (let i = 0; i < numPlayers; i++) {
        if (scores[i] > maxScore) {
          maxScore = scores[i];
          winners = [i];
        } else if (scores[i] === maxScore) {
          winners.push(i);
        }
      }
      
      if (winners.length === 1) {
        toast.success(`Player ${winners[0] + 1} wins with ${scores[winners[0]]} boxes!`, {
          icon: <Trophy className="w-5 h-5 text-yellow-500" />
        });
      } else {
        toast.info(`It's a tie between players ${winners.map(w => w + 1).join(' and ')}!`, {
          icon: <Trophy className="w-5 h-5 text-yellow-500" />
        });
      }
    }
    
    // If a box was completed, the current player gets another turn
    if (!boxCompleted) {
      setCurrentPlayer((currentPlayer + 1) % numPlayers);
    }
  };
  
  // Draw the game
  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Calculate dot size and spacing based on canvas size
    const dotSize = 8;
    const spacing = Math.min(rect.width, rect.height) / gridSize;
    const offset = dotSize / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid dots
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.arc(
          x * spacing + offset,
          y * spacing + offset,
          dotSize / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#64748b";
        ctx.fill();
      }
    }
    
    // Draw horizontal lines
    horizontalLines.forEach(line => {
      if (line.drawn) {
        ctx.beginPath();
        ctx.moveTo(
          line.startX * spacing + offset,
          line.startY * spacing + offset
        );
        ctx.lineTo(
          line.endX * spacing + offset,
          line.endY * spacing + offset
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = PLAYER_COLORS[line.owner];
        ctx.stroke();
      }
    });
    
    // Draw vertical lines
    verticalLines.forEach(line => {
      if (line.drawn) {
        ctx.beginPath();
        ctx.moveTo(
          line.startX * spacing + offset,
          line.startY * spacing + offset
        );
        ctx.lineTo(
          line.endX * spacing + offset,
          line.endY * spacing + offset
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = PLAYER_COLORS[line.owner];
        ctx.stroke();
      }
    });
    
    // Fill in completed boxes
    boxes.forEach(box => {
      if (box.complete) {
        ctx.fillStyle = `${PLAYER_COLORS[box.owner]}40`; // Add transparency
        ctx.fillRect(
          box.x * spacing + offset - dotSize / 2,
          box.y * spacing + offset - dotSize / 2,
          spacing,
          spacing
        );
      }
    });
    
    // Draw horizontal line hitboxes (for mouse interaction)
    for (let i = 0; i < horizontalLines.length; i++) {
      const line = horizontalLines[i];
      ctx.fillStyle = "rgba(0,0,0,0)"; // Transparent hitbox
      ctx.fillRect(
        line.startX * spacing + offset,
        line.startY * spacing + offset - 5,
        spacing,
        10
      );
    }
    
    // Draw vertical line hitboxes (for mouse interaction)
    for (let i = 0; i < verticalLines.length; i++) {
      const line = verticalLines[i];
      ctx.fillStyle = "rgba(0,0,0,0)"; // Transparent hitbox
      ctx.fillRect(
        line.startX * spacing + offset - 5,
        line.startY * spacing + offset,
        10,
        spacing
      );
    }
  }, [gameStarted, grid, horizontalLines, verticalLines, boxes, gridSize]);
  
  // Handle canvas click
  const handleCanvasClick = (e) => {
    if (!gameStarted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const dotSize = 8;
    const spacing = Math.min(canvas.width, canvas.height) / gridSize;
    const offset = dotSize / 2;
    
    // Check if we clicked on a horizontal line
    for (let i = 0; i < horizontalLines.length; i++) {
      const line = horizontalLines[i];
      const startX = line.startX * spacing + offset;
      const startY = line.startY * spacing + offset;
      const endX = line.endX * spacing + offset;
      
      // Check if the click is within the hitbox of this horizontal line
      if (
        x >= startX && x <= endX &&
        y >= startY - 5 && y <= startY + 5 &&
        !line.drawn
      ) {
        handleLineClick(true, i);
        return;
      }
    }
    
    // Check if we clicked on a vertical line
    for (let i = 0; i < verticalLines.length; i++) {
      const line = verticalLines[i];
      const startX = line.startX * spacing + offset;
      const startY = line.startY * spacing + offset;
      const endY = line.endY * spacing + offset;
      
      // Check if the click is within the hitbox of this vertical line
      if (
        y >= startY && y <= endY &&
        x >= startX - 5 && x <= startX + 5 &&
        !line.drawn
      ) {
        handleLineClick(false, i);
        return;
      }
    }
  };
  
  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        
        // Set canvas size based on its container size
        const size = Math.min(container.clientWidth, 500);
        canvas.width = size;
        canvas.height = size;
      }
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gameStarted]);
  
  // Show game instructions
  const showInstructions = () => {
    toast.info(
      "Take turns drawing lines between dots. When you complete a box, you'll score a point and get another turn. The player with the most boxes at the end wins!",
      {
        icon: <Info className="w-5 h-5 text-blue-500" />,
        autoClose: 6000,
      }
    );
  };
  
  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Game area */}
        <div className="flex-1 order-2 md:order-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {gameStarted ? "Connect the Dots" : "Start a New Game"}
            </h2>
            
            <div className="flex space-x-2">
              <button
                onClick={showInstructions}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                aria-label="Instructions"
              >
                <Info className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                aria-label={showSettings ? "Hide settings" : "Show settings"}
              >
                {showSettings ? (
                  <ChevronUp className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                )}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Grid Size</label>
                      <select
                        value={gridSize}
                        onChange={(e) => setGridSize(Number(e.target.value))}
                        disabled={gameStarted}
                        className="w-full py-2 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary"
                      >
                        <option value={3}>3×3</option>
                        <option value={4}>4×4</option>
                        <option value={5}>5×5</option>
                        <option value={6}>6×6</option>
                        <option value={7}>7×7</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Players</label>
                      <select
                        value={numPlayers}
                        onChange={(e) => setNumPlayers(Number(e.target.value))}
                        disabled={gameStarted}
                        className="w-full py-2 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary"
                      >
                        <option value={2}>2 Players</option>
                        <option value={3}>3 Players</option>
                        <option value={4}>4 Players</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!gameStarted ? (
            <div className="text-center py-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="btn btn-primary text-lg px-6 py-3"
              >
                Start Game
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div 
                className="mb-8 relative bg-surface-50 dark:bg-surface-800 rounded-xl shadow-inner p-4"
                style={{ maxWidth: '500px', width: '100%', aspectRatio: '1/1' }}
              >
                <canvas 
                  ref={canvasRef} 
                  onClick={handleCanvasClick}
                  className="block mx-auto cursor-pointer"
                />
              </div>
              
              <div className="w-full mb-4">
                <button 
                  onClick={resetGame}
                  className="btn btn-outline flex items-center justify-center space-x-2 w-full"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>New Game</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Scoreboard */}
        {gameStarted && (
          <div className="order-1 md:order-2 md:w-64 flex-shrink-0">
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Scoreboard
              </h3>
              
              <div className="space-y-3">
                {Array.from({ length: numPlayers }).map((_, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      currentPlayer === index 
                        ? 'bg-white dark:bg-surface-700 shadow-soft'
                        : 'bg-surface-50 dark:bg-surface-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: PLAYER_COLORS[index] }}
                        ></div>
                        <span className={`font-medium ${
                          currentPlayer === index ? 'text-primary' : ''
                        }`}>
                          Player {index + 1}
                        </span>
                      </div>
                      <span className="text-lg font-bold">{scores[index]}</span>
                    </div>
                    
                    {currentPlayer === index && (
                      <div className="text-xs mt-1 text-surface-500">
                        Current turn
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;