import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Define available player colors with nice rgb values
const COLOR_OPTIONS = [
  'rgb(93, 101, 239)',  // primary (blue)
  'rgb(255, 121, 80)',  // secondary (orange)
  'rgb(16, 185, 129)',  // accent (green)
  'rgb(168, 85, 247)',  // purple
  'rgb(236, 72, 153)',  // pink
  'rgb(234, 88, 12)',   // orange-dark
  'rgb(217, 70, 239)',  // fuchsia
  'rgb(202, 138, 4)',   // yellow-dark
];

function PlayerSettings({ numPlayers, players, onUpdatePlayers }) {
  const User = getIcon('User');
  const Check = getIcon('Check');
  
  // Initialize players array with default values if not provided
  const [localPlayers, setLocalPlayers] = useState(players || []);
  
  // Update local players when numPlayers changes
  useEffect(() => {
    // Create new array with the right number of players
    const newPlayers = Array(numPlayers).fill(null).map((_, index) => {
      // Use existing player data if available, otherwise create default
      return players[index] || {
        name: `Player ${index + 1}`,
        color: COLOR_OPTIONS[index % COLOR_OPTIONS.length]
      };
    });
    
    setLocalPlayers(newPlayers);
    onUpdatePlayers(newPlayers);
  }, [numPlayers]);
  
  // Handle player name change
  const handleNameChange = (index, newName) => {
    const updatedPlayers = [...localPlayers];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      name: newName || `Player ${index + 1}`
    };
    setLocalPlayers(updatedPlayers);
    onUpdatePlayers(updatedPlayers);
  };
  
  // Handle player color change
  const handleColorChange = (index, newColor) => {
    const updatedPlayers = [...localPlayers];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      color: newColor
    };
    setLocalPlayers(updatedPlayers);
    onUpdatePlayers(updatedPlayers);
  };
  
  return (
    <div className="space-y-4 mt-2">
      {localPlayers.map((player, index) => (
        <div key={index} className="bg-white dark:bg-surface-700 rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: player.color }}>
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="w-full py-1 px-2 rounded border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm"
              />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button key={color} onClick={() => handleColorChange(index, color)} className="color-option" style={{ backgroundColor: color }}>
                {color === player.color && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayerSettings;