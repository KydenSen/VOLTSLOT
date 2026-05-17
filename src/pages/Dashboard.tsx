import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBooking } from '@/contexts/BookingContext';
// Admin components removed: StatsCards, ChargerStatus, RegisteredUsers
import SlotGrid from '@/components/dashboard/SlotGrid';
import ActiveBookings from '@/components/dashboard/ActiveBookings';
import StationMap from '@/components/dashboard/StationMap';
import StationSearch from '@/components/dashboard/StationSearch';
import StationBottomSheet from '@/components/dashboard/StationBottomSheet';
import UserProfile from '@/components/dashboard/UserProfile';
import { List, LogOut, Sun, Moon, Menu, ChevronLeft, MapPin, User, Zap } from 'lucide-react';
import { Station } from '@/types';

const Dashboard = () => {
  const [active, setActive] = useState('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [filteredStations, setFilteredStations] = useState<Station[] | undefined>(undefined);
  const [bottomSheetStation, setBottomSheetStation] = useState<Station | null>(null);
  const [carPosition, setCarPosition] = useState(-100);
  const [showCar, setShowCar] = useState(false);
  const handleSearchResults = useCallback((stations: Station[] | undefined) => setFilteredStations(stations), []);
  const { user, logout, loading } = useAuth();
  const { isDark, toggle } = useTheme();
  const { usingMockData } = useBooking();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 50 && !showCar) {
        setShowCar(true);
      }
      if (showCar) {
        const newPosition = Math.min(scrolled * 0.5, 100);
        setCarPosition(newPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showCar]);

  if (loading) return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center space-y-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: 360
          }}
          transition={{ 
            scale: { duration: 1.5, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <Zap className="h-8 w-8 text-primary" />
        </motion.div>
        <motion.p 
          className="text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading VoltSlot...
        </motion.p>
      </motion.div>
    </motion.div>
  );
  if (!user) return null;

  const navItems = [
    { id: 'map', label: 'Map View', icon: MapPin },
    { id: 'bookings', label: 'My Bookings', icon: List },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleMapStationClick = (station: Station) => {
    setBottomSheetStation(station);
  };

  const handleSelectStationForBooking = (station: Station) => {
    setSelectedStation(station);
    setActive('book');
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const renderContent = () => {
    switch (active) {
      case 'map':
        return (
          <div className="relative" style={{ height: 'calc(100vh - 4rem)' }}>
            {/* Search bar floating over the map */}
            <div className="absolute top-4 left-[52px] right-4 z-[500]">
              <StationSearch onResults={handleSearchResults} />
            </div>
            {/* Full-screen map */}
            <StationMap onSelectStation={handleMapStationClick} filteredStations={filteredStations} height="100%" />
            {/* Bottom sheet */}
            <AnimatePresence>
              {bottomSheetStation && (
                <StationBottomSheet
                  station={bottomSheetStation}
                  onClose={() => setBottomSheetStation(null)}
                  onSwitchStation={(s) => setBottomSheetStation(s)}
                  onViewBookings={() => setActive('bookings')}
                />
              )}
            </AnimatePresence>
          </div>
        );
      case 'book':
        return (
          <motion.div 
            className="p-6"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SlotGrid
              station={selectedStation}
              onBack={() => { setSelectedStation(null); setActive('map'); }}
              onViewBookings={() => setActive('bookings')}
            />
          </motion.div>
        );
      case 'bookings':
        return (
          <motion.div 
            className="p-6"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ActiveBookings />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div 
            className="p-6"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <UserProfile />
          </motion.div>
        );
      /* Admin views removed */
      default:
        return null;
    }
  };

  const pageTitle = () => {
    switch (active) {
      case 'map': return 'Discover Stations';
      case 'book': return selectedStation ? `Book — ${selectedStation.name}` : 'Book a Slot';
      case 'bookings': return 'My Bookings';
      case 'profile': return 'Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Animated Car */}
      <div 
        className="fixed bottom-8 left-0 z-5 pointer-events-none transition-all duration-300 ease-out"
        style={{
          transform: `translateX(${carPosition - 100}%)`,
          opacity: showCar ? 1 : 0,
        }}
      >
        <svg width="120" height="80" viewBox="0 0 120 80" className="drop-shadow-lg">
          {/* Car body */}
          <rect x="20" y="35" width="80" height="25" rx="4" fill="currentColor" className="text-primary" opacity="0.9" />
          
          {/* Car top */}
          <rect x="35" y="20" width="50" height="20" rx="3" fill="currentColor" className="text-primary" />
          
          {/* Windows */}
          <rect x="38" y="23" width="15" height="12" rx="1" fill="currentColor" className="text-primary/30" opacity="0.6" />
          <rect x="67" y="23" width="15" height="12" rx="1" fill="currentColor" className="text-primary/30" opacity="0.6" />
          
          {/* Front bumper */}
          <rect x="15" y="48" width="8" height="12" rx="1" fill="currentColor" className="text-primary/70" />
          
          {/* Wheels */}
          <circle cx="35" cy="62" r="8" fill="#1f2937" />
          <circle cx="35" cy="62" r="5" fill="#4b5563" />
          <circle cx="85" cy="62" r="8" fill="#1f2937" />
          <circle cx="85" cy="62" r="5" fill="#4b5563" />
          
          {/* Wheel details */}
          <circle cx="35" cy="62" r="2" fill="#9ca3af" />
          <circle cx="85" cy="62" r="2" fill="#9ca3af" />
          
          {/* Lightning bolt on car */}
          <g transform="translate(55, 38)">
            <path d="M 0,-8 L -3,0 L 0,0 L -2,8 L 4,0 L 2,0 Z" fill="#fbbf24" opacity="0.8" />
          </g>
          
          {/* Speed lines */}
          <line x1="5" y1="50" x2="12" y2="50" stroke="currentColor" className="text-primary/50" strokeWidth="2" />
          <line x1="8" y1="55" x2="14" y2="55" stroke="currentColor" className="text-primary/40" strokeWidth="2" />
          <line x1="6" y1="60" x2="13" y2="60" stroke="currentColor" className="text-primary/30" strokeWidth="2" />
        </svg>
      </div>
      {/* Sidebar */}
      <motion.aside 
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border flex flex-col shrink-0`}
        animate={{ width: sidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="p-4 flex items-center gap-2 border-b border-border"
          layout
        >
          <motion.div 
            className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-5 w-5 text-primary" />
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span 
                className="font-extrabold text-lg tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-primary">Volt</span><span className="text-foreground">Slot</span>
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
        </motion.div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => { setActive(item.id); setBottomSheetStation(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active === item.id
                  ? 'bg-primary/15 text-primary font-semibold shadow-sm shadow-primary/5'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                animate={active === item.id ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active === item.id ? 'text-primary' : ''}`} />
              </motion.div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-0.5">
          <motion.button 
            onClick={toggle} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {isDark ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button 
            onClick={async () => { await logout(); navigate('/'); }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {active !== 'map' && (
          <motion.header 
            className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <motion.h1 
                className="text-lg font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {pageTitle()}
              </motion.h1>
              <motion.p 
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome, {user.fullName || user.email}
              </motion.p>
            </div>
          </motion.header>
        )}
        <div className={active === 'map' ? 'flex-1' : 'flex-1 overflow-y-auto'}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
