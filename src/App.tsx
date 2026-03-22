import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Signal, 
  Battery as BatteryIcon, 
  Search,
  Mic,
  Settings,
  Bell,
  Moon,
  Sun,
  Volume2,
  Bluetooth,
  Plane,
  Maximize2,
  Music,
  Play,
  Shield,
  Cloud,
  Camera
} from 'lucide-react';
import { SYSTEM_APPS } from './constants';
import { AppConfig } from './types';
import { soundService } from './services/soundService';

// --- Sub-components ---

const StatusBar = ({ time }: { time: Date }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-50 pointer-events-none">
      <div className="text-sm font-semibold tracking-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex items-center gap-1.5">
        <Signal size={16} />
        <Wifi size={16} />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold">100%</span>
          <BatteryIcon size={18} className="rotate-90" />
        </div>
      </div>
    </div>
  );
};

const DynamicIsland = ({ activeApp, notification }: { activeApp: AppConfig | null, notification: string | null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60]">
      <motion.div
        layout
        initial={{ width: 120, height: 36, borderRadius: 18 }}
        animate={{ 
          width: isExpanded ? 340 : (notification ? 240 : (activeApp ? 180 : 120)), 
          height: isExpanded ? 180 : 36,
          borderRadius: isExpanded ? 40 : 18,
          scale: isPulsing ? [1, 1.05, 1] : 1
        }}
        transition={{ 
          type: 'spring', 
          damping: 20, 
          stiffness: 200,
          scale: { duration: 0.4, repeat: isPulsing ? 3 : 0 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundService.play('tap');
          setIsExpanded(!isExpanded);
        }}
        className="bg-black flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl relative"
      >
        {/* Subtle Glow for ongoing activity */}
        {activeApp && !isExpanded && (
          <motion.div 
            className={`absolute inset-0 ${activeApp.color} opacity-10 blur-xl`}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div 
              key="expanded"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="p-6 w-full h-full flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${activeApp?.color || 'bg-zinc-800'} flex items-center justify-center shadow-lg`}>
                  {activeApp ? <activeApp.icon size={24} className="text-white" /> : <Settings size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{notification || activeApp?.name || 'NeoOS System'}</h3>
                  <p className="text-white/50 text-sm">{notification ? 'Notification' : 'Active Session'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-2xl bg-white/10 font-semibold hover:bg-white/20 transition-colors">
                  {notification ? 'View' : 'Action'}
                </button>
                <button className="flex-1 py-3 rounded-2xl bg-white/10 font-semibold hover:bg-white/20 transition-colors">
                  Dismiss
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 px-4 w-full justify-between"
            >
              {notification ? (
                <div className="flex items-center gap-3 w-full">
                  <Bell size={14} className="text-yellow-400 animate-pulse" />
                  <span className="text-xs font-semibold truncate flex-1">{notification}</span>
                </div>
              ) : activeApp ? (
                <>
                  <div className={`w-6 h-6 rounded-full ${activeApp.color} flex items-center justify-center shadow-sm`}>
                    <activeApp.icon size={12} className="text-white" />
                  </div>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const AppIcon = ({ app, onClick }: { app: AppConfig, onClick: () => void }) => {
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.1,
        y: -4,
      }}
      whileTap={{ 
        scale: 0.9,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      onClick={() => {
        soundService.play('tap');
        onClick();
      }}
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
    >
      <div className={`w-16 h-16 rounded-[1.2rem] ${app.color} flex items-center justify-center shadow-lg relative overflow-hidden`}>
        <motion.div 
          className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors"
        />
        <app.icon size={32} className={app.name === 'Calendar' ? 'text-rose-500' : 'text-white'} />
        
        {/* Subtle inner glow on hover */}
        <div className="absolute inset-0 rounded-[1.2rem] border border-white/0 group-hover:border-white/20 transition-colors" />
      </div>
      <motion.span 
        animate={{ opacity: [0.9, 1] }}
        className="text-[11px] font-medium text-white/90 tracking-tight group-hover:text-white transition-colors"
      >
        {app.name}
      </motion.span>
    </motion.div>
  );
};

const ControlCenter = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] p-6 pt-16 glass-dark"
        >
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {/* Connectivity Block */}
            <div className="glass p-4 rounded-3xl grid grid-cols-2 gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center"><Plane size={20} /></div>
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center"><Wifi size={20} /></div>
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center"><Bluetooth size={20} /></div>
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center"><Signal size={20} /></div>
            </div>

            {/* Music Block */}
            <div className="glass p-4 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center"><Music size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">Not Playing</p>
                  <p className="text-[10px] opacity-50">NeoOS Music</p>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <Play size={16} fill="white" />
              </div>
            </div>

            {/* Brightness & Volume */}
            <div className="glass p-4 rounded-3xl flex flex-col gap-4">
              <div className="flex-1 bg-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white/20" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Sun size={20} className="opacity-50" />
                </div>
              </div>
            </div>
            <div className="glass p-4 rounded-3xl flex flex-col gap-4">
              <div className="flex-1 bg-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/20" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Volume2 size={20} className="opacity-50" />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="glass p-4 rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => soundService.play('tap')}><Bell size={20} /></div>
            <div className="glass p-4 rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => soundService.play('tap')}><Moon size={20} /></div>
            <div className="glass p-4 rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => soundService.play('tap')}><Maximize2 size={20} /></div>
            <div className="glass p-4 rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => soundService.play('tap')}><Settings size={20} /></div>
          </div>

          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/30 rounded-full cursor-pointer"
            onClick={() => {
              soundService.play('tap');
              onClose();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppWindow = ({ app, onClose }: { app: AppConfig, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 100 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col"
    >
      <div className="h-12 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-md ${app.color} flex items-center justify-center`}>
            <app.icon size={12} className="text-white" />
          </div>
          <span className="font-semibold text-sm">{app.name}</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <Settings size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className={`w-32 h-32 rounded-full ${app.color} flex items-center justify-center blur-3xl opacity-20 absolute`}
        />
        <app.icon size={64} className="mb-6 opacity-80" />
        <h2 className="text-3xl font-bold mb-2">{app.name}</h2>
        <p className="text-white/50 max-w-xs">
          This is a prototype of the {app.name} app for NeoOS. Experience the future of mobile interaction.
        </p>
      </div>

      <div className="p-8 flex justify-center">
        <div 
          className="w-32 h-1.5 bg-white/30 rounded-full cursor-pointer hover:bg-white/50 transition-colors"
          onClick={() => {
            soundService.play('tap');
            onClose();
          }}
        />
      </div>
    </motion.div>
  );
};

const LockScreen = ({ time, onUnlock }: { time: Date, onUnlock: () => void }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-between py-20 px-8"
    >
      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-purple-900/40 to-black" />
        <img 
          src="https://picsum.photos/seed/neoos/1080/1920?blur=2" 
          alt="Wallpaper" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <Shield size={16} />
          <span className="text-xs font-semibold tracking-widest uppercase">NeoOS Secure</span>
        </div>
        <h1 className="text-8xl font-light tracking-tighter">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </h1>
        <p className="text-xl font-medium text-white/70">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="glass p-4 rounded-[2rem] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Cloud size={16} className="text-sky-400" />
            <span className="text-[10px] font-bold opacity-50">24°</span>
          </div>
          <p className="text-[10px] font-medium opacity-70">Mostly Clear</p>
        </div>
        <div className="glass p-4 rounded-[2rem] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <BatteryIcon size={16} className="text-emerald-400 rotate-90" />
            <span className="text-[10px] font-bold opacity-50">100%</span>
          </div>
          <p className="text-[10px] font-medium opacity-70">Charged</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 opacity-50"
        >
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-widest">Swipe up to unlock</span>
        </motion.div>
        
        <div className="flex gap-12">
          <div className="w-14 h-14 rounded-full glass flex items-center justify-center"><Camera size={24} /></div>
          <div className="w-14 h-14 rounded-full glass flex items-center justify-center"><Search size={24} /></div>
        </div>
      </div>

      <div 
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={() => {
          soundService.play('unlock');
          onUnlock();
        }}
      />
    </motion.div>
  );
};

const AppLibrary = ({ isOpen, onClose, onAppClick }: { isOpen: boolean, onClose: () => void, onAppClick: (app: AppConfig) => void }) => {
  const categories = ['System', 'Social', 'Media', 'Utilities', 'Games'];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl p-6 pt-20 overflow-y-auto no-scrollbar"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">App Library</h2>
              <button onClick={onClose} className="glass px-4 py-2 rounded-full text-sm font-semibold">Done</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categories.map(cat => {
                const apps = SYSTEM_APPS.filter(a => a.category === cat);
                if (apps.length === 0) return null;
                
                return (
                  <div key={cat} className="glass p-4 rounded-[2.5rem] aspect-square flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      {apps.slice(0, 4).map(app => (
                        <div 
                          key={app.id} 
                          onClick={() => onAppClick(app)}
                          className={`w-full aspect-square rounded-2xl ${app.color} flex items-center justify-center shadow-md cursor-pointer`}
                        >
                          <app.icon size={20} className="text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold opacity-50 uppercase tracking-widest text-center">{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AIAssistant = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed inset-x-0 bottom-0 z-[150] h-[60vh] glass-dark rounded-t-[3rem] p-8 flex flex-col items-center"
        >
          <div className="w-12 h-1.5 bg-white/20 rounded-full mb-8" onClick={onClose} />
          
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-2xl absolute -inset-4"
              />
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative z-10 shadow-2xl">
                <Mic size={40} className="text-black" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">How can I help?</h2>
              <p className="text-white/50">NeoAI is listening...</p>
            </div>

            <div className="w-full max-w-xs flex flex-col gap-2">
              <button className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">"What's the weather like?"</button>
              <button className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">"Open my messages"</button>
              <button className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">"Set a timer for 5 minutes"</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---

export default function App() {
  const [time, setTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState<AppConfig | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isAppLibraryOpen, setIsAppLibraryOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate a notification after unlock
  useEffect(() => {
    if (!isLocked) {
      const timer = setTimeout(() => {
        setNotification('New message from NeoOS Team');
        soundService.play('notification');
        setTimeout(() => setNotification(null), 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  const handleAppClick = (app: AppConfig) => {
    soundService.play('launch');
    setActiveApp(app);
    setIsAppLibraryOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white font-sans overflow-hidden">
      <AnimatePresence>
        {isLocked && <LockScreen time={time} onUnlock={() => setIsLocked(false)} />}
      </AnimatePresence>

      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-60" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <StatusBar time={time} />
      <DynamicIsland activeApp={activeApp} notification={notification} />
      
      {/* Control Center Trigger (Invisible top-right area) */}
      <div 
        className="absolute top-0 right-0 w-24 h-12 z-[70] cursor-pointer"
        onClick={() => setIsControlCenterOpen(true)}
      />

      <ControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
      <AppLibrary 
        isOpen={isAppLibraryOpen} 
        onClose={() => setIsAppLibraryOpen(false)} 
        onAppClick={handleAppClick} 
      />
      <AIAssistant isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />

      {/* Home Screen Content */}
      <main className="relative z-10 h-full flex flex-col pt-20 pb-32 px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="glass h-12 rounded-2xl flex items-center px-4 gap-3">
            <Search size={18} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Search apps, files, or web"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Mic size={18} className="text-white/40 cursor-pointer" onClick={() => setIsAIAssistantOpen(true)} />
          </div>
        </div>

        {/* Widgets Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass p-5 rounded-[2rem] flex flex-col justify-between aspect-square"
          >
            <div className="flex justify-between items-start">
              <Cloud className="text-sky-400" size={28} />
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Weather</span>
            </div>
            <div>
              <h2 className="text-4xl font-light tracking-tighter">24°</h2>
              <p className="text-xs font-medium opacity-70">San Francisco</p>
              <p className="text-[10px] opacity-40">Mostly Clear • H:26° L:18°</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass p-5 rounded-[2rem] flex flex-col justify-between aspect-square"
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Battery</span>
            </div>
            <div>
              <h2 className="text-4xl font-light tracking-tighter">100%</h2>
              <p className="text-xs font-medium opacity-70">NeoOS Pro</p>
              <p className="text-[10px] opacity-40">Fully Charged</p>
            </div>
          </motion.div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 flex-1 content-start overflow-y-auto no-scrollbar">
          {SYSTEM_APPS.filter(app => 
            app.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(app => (
            <div key={app.id}>
              <AppIcon app={app} onClick={() => handleAppClick(app)} />
            </div>
          ))}
          
          {/* App Library Trigger */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAppLibraryOpen(true)}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[1.2rem] glass flex items-center justify-center shadow-lg">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/40" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-white/90 tracking-tight">Library</span>
          </motion.div>
        </div>
      </main>

      {/* Dock */}
      <div className="fixed bottom-8 left-6 right-6 z-20">
        <div className="glass h-20 rounded-[2.5rem] flex items-center justify-around px-4 shadow-2xl">
          {SYSTEM_APPS.slice(0, 4).map(app => (
            <motion.div
              key={app.id}
              whileHover={{ 
                y: -12,
                scale: 1.2,
                filter: 'brightness(1.1)'
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => handleAppClick(app)}
              className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center shadow-xl cursor-pointer relative group`}
            >
              <app.icon size={28} className="text-white" />
              {/* Subtle reflection/glow under dock icons */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Bar (Home Indicator) */}
      <div 
        className="fixed bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/30 rounded-full z-30 cursor-pointer hover:bg-white/50 transition-colors" 
        onClick={() => {
          if (activeApp) {
            soundService.play('tap');
            setActiveApp(null);
          } else {
            soundService.play('lock');
            setIsLocked(true);
          }
        }}
      />

      {/* App Windows */}
      <AnimatePresence>
        {activeApp && (
          <AppWindow 
            app={activeApp} 
            onClose={() => setActiveApp(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

