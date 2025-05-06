import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home({ darkMode, toggleDarkMode }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Declare icon components
  const Moon = getIcon('Moon');
  const Sun = getIcon('Sun');
  const Logo = getIcon('Grid');
  const Info = getIcon('Info');
  
  // Simulating initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const showInfo = () => {
    toast.info("DotNexus is a modern take on the classic 'Dots and Boxes' game. Take turns drawing lines and complete boxes to score points!", {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      autoClose: 6000,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 0, 0, 0, 0, 0, 360],
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="text-primary"
        >
          <Logo size={48} />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DotNexus
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={showInfo}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
              aria-label="Game Info"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Moon className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MainFeature />
        </motion.div>
      </main>
      
      <footer className="border-t border-surface-200 dark:border-surface-700 py-4 md:py-6">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500">
          <p className="mb-0">© {new Date().getFullYear()} DotNexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;