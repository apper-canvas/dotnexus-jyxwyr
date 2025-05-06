import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound({ darkMode, toggleDarkMode }) {
  // Declare icon components
  const Moon = getIcon('Moon');
  const Sun = getIcon('Sun');
  const Home = getIcon('Home');
  const FrownIcon = getIcon('Frown');
  const Logo = getIcon('Grid');
  
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
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <FrownIcon className="w-20 h-20 md:w-24 md:h-24 text-secondary" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">404</h1>
          <p className="text-xl md:text-2xl mb-8 text-surface-600 dark:text-surface-300">
            Oops! The page you're looking for has vanished!
          </p>
          
          <Link 
            to="/"
            className="btn btn-primary inline-flex items-center space-x-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
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

export default NotFound;