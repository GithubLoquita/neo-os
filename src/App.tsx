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
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Shield,
  Cloud,
  Camera,
  User,
  Lock,
  Globe,
  Info,
  ChevronRight,
  Heart,
  ListMusic,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Image,
  Folder,
  Mail,
  Calendar,
  Cpu,
  Send,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Video,
  Grid,
  History,
  Star,
  Hash,
  Delete,
  X
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

const MusicApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div className="flex-1 flex flex-col p-8 bg-gradient-to-b from-rose-900/40 to-black overflow-y-auto">
      <div className="flex flex-col items-center gap-8 mb-12">
        <motion.div 
          animate={{ scale: isPlaying ? 1 : 0.9 }}
          className="w-64 h-64 rounded-2xl shadow-2xl overflow-hidden"
        >
          <img 
            src="https://picsum.photos/seed/music/600/600" 
            alt="Album Art" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-1">Midnight City</h2>
          <p className="text-rose-400 font-medium">M83 — Hurry Up, We're Dreaming</p>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="space-y-2">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${progress}%` }}
              className="h-full bg-white"
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold opacity-50 uppercase tracking-widest">
            <span>1:24</span>
            <span>4:03</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <button className="text-white/40 hover:text-white transition-colors">
            <Shuffle size={20} />
          </button>
          <div className="flex items-center gap-8">
            <button className="text-white hover:scale-110 transition-transform">
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white hover:scale-110 transition-transform">
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>
          <button className="text-white/40 hover:text-white transition-colors">
            <Repeat size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-12 pt-8">
          <button className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Heart size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Like</span>
          </button>
          <button className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <ListMusic size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Playlist</span>
          </button>
          <button className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Volume2 size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">AirPlay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsApp = () => {
  const sections = [
    {
      title: 'Personal',
      items: [
        { icon: User, label: 'Neo Account', detail: 'Sandip Hembram', color: 'bg-blue-500' },
        { icon: Shield, label: 'Privacy & Security', color: 'bg-emerald-500' },
      ]
    },
    {
      title: 'Connectivity',
      items: [
        { icon: Wifi, label: 'Wi-Fi', detail: 'Neo_Fiber_5G', color: 'bg-blue-400' },
        { icon: Bluetooth, label: 'Bluetooth', detail: 'On', color: 'bg-indigo-500' },
        { icon: Plane, label: 'Airplane Mode', toggle: true, color: 'bg-orange-500' },
      ]
    },
    {
      title: 'System',
      items: [
        { icon: Bell, label: 'Notifications', color: 'bg-rose-500' },
        { icon: Moon, label: 'Focus', color: 'bg-purple-500' },
        { icon: Maximize2, label: 'Display & Brightness', color: 'bg-sky-500' },
      ]
    },
    {
      title: 'General',
      items: [
        { icon: Info, label: 'About', color: 'bg-zinc-500' },
        { icon: Globe, label: 'Language & Region', detail: 'English (US)', color: 'bg-zinc-400' },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="space-y-2">
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest ml-4">{section.title}</p>
              <div className="glass rounded-2xl overflow-hidden">
                {section.items.map((item, j) => (
                  <div 
                    key={j}
                    className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer ${j !== section.items.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon size={18} className="text-white" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.detail && <span className="text-sm opacity-40">{item.detail}</span>}
                      {item.toggle ? (
                        <div className="w-10 h-6 rounded-full bg-white/10 p-1">
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </div>
                      ) : (
                        <ChevronRight size={16} className="opacity-20" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PhoneApp = () => {
  const [dialed, setDialed] = useState('');
  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="flex-1 flex flex-col bg-black p-8">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="h-20 flex items-center justify-center">
          <h2 className="text-5xl font-light tracking-tight">{dialed || ' '}</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {keypad.map(key => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.9, backgroundColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => {
                soundService.play('tap');
                setDialed(prev => prev + key);
              }}
              className="w-20 h-20 rounded-full bg-white/10 flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-3xl font-medium">{key}</span>
              {key === '0' && <span className="text-[10px] font-bold opacity-40 mt-[-4px]">+</span>}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-12 mt-4">
          <div className="w-16 h-16" /> {/* Spacer */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            onClick={() => soundService.play('tap')}
          >
            <Phone size={32} fill="white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDialed(prev => prev.slice(0, -1))}
            className="w-16 h-16 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
          >
            <Delete size={24} />
          </motion.button>
        </div>
      </div>

      <div className="flex justify-around items-center py-4 border-t border-white/5 opacity-40">
        <div className="flex flex-col items-center gap-1"><Star size={18} /><span className="text-[9px] font-bold uppercase tracking-widest">Favorites</span></div>
        <div className="flex flex-col items-center gap-1"><Clock size={18} /><span className="text-[9px] font-bold uppercase tracking-widest">Recents</span></div>
        <div className="flex flex-col items-center gap-1"><User size={18} /><span className="text-[9px] font-bold uppercase tracking-widest">Contacts</span></div>
        <div className="flex flex-col items-center gap-1 text-emerald-400 opacity-100"><Grid size={18} /><span className="text-[9px] font-bold uppercase tracking-widest">Keypad</span></div>
      </div>
    </div>
  );
};

const MessagesApp = () => {
  const chats = [
    { name: 'Sarah Miller', last: 'See you at 8! 🚀', time: '9:41 AM', unread: true },
    { name: 'Tech Support', last: 'Your NeoOS update is ready.', time: 'Yesterday', unread: false },
    { name: 'Alex Rivera', last: 'Did you check the new widgets?', time: 'Tuesday', unread: false },
    { name: 'Mom', last: 'Call me when you can.', time: 'Monday', unread: true },
  ];

  return (
    <div className="flex-1 bg-black overflow-y-auto no-scrollbar">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {chats.map((chat, i) => (
            <motion.div 
              key={i}
              whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => soundService.play('tap')}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center relative">
                <User size={24} className="opacity-40" />
                {chat.unread && <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold truncate">{chat.name}</h3>
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.unread ? 'text-white font-medium' : 'text-white/40'}`}>{chat.last}</p>
              </div>
              <ChevronRight size={16} className="opacity-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BrowserApp = () => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900">
      <div className="p-4 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center gap-3">
        <div className="flex-1 h-10 rounded-xl bg-white/10 flex items-center px-4 gap-2">
          <Lock size={12} className="opacity-40" />
          <span className="text-sm opacity-60">neoos.com/explore</span>
        </div>
        <button onClick={() => soundService.play('tap')}><History size={20} className="opacity-40" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-md mx-auto flex flex-col gap-8">
          <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 flex flex-col justify-end shadow-2xl">
            <h2 className="text-3xl font-bold leading-tight">The Future of Interaction.</h2>
            <p className="opacity-70 text-sm mt-2">Explore the new NeoOS ecosystem and its revolutionary features.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass p-4 rounded-2xl flex flex-col gap-3">
                <div className="w-full aspect-square rounded-xl bg-white/5" />
                <div className="h-3 w-3/4 bg-white/20 rounded-full" />
                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 flex justify-between items-center opacity-40">
        <ChevronRight size={20} className="rotate-180" />
        <ChevronRight size={20} />
        <Search size={20} />
        <Grid size={20} />
      </div>
    </div>
  );
};

const WeatherApp = () => {
  const forecast = [
    { time: 'Now', temp: '24°', icon: Sun },
    { time: '1PM', temp: '25°', icon: Sun },
    { time: '2PM', temp: '26°', icon: Sun },
    { time: '3PM', temp: '26°', icon: Cloud },
    { time: '4PM', temp: '25°', icon: Cloud },
    { time: '5PM', temp: '23°', icon: Cloud },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-sky-400 to-blue-600 p-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center text-center gap-2 mb-12">
        <h1 className="text-3xl font-medium">San Francisco</h1>
        <h2 className="text-8xl font-light tracking-tighter">24°</h2>
        <p className="text-lg font-medium opacity-80">Mostly Clear</p>
        <p className="text-sm font-bold opacity-60">H:26° L:18°</p>
      </div>

      <div className="glass rounded-[2rem] p-6 mb-6">
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">Hourly Forecast</p>
        <div className="flex justify-between overflow-x-auto no-scrollbar gap-6">
          {forecast.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-3 min-w-[40px]">
              <span className="text-xs font-bold">{f.time}</span>
              <f.icon size={20} />
              <span className="text-sm font-bold">{f.temp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-[2rem] p-6">
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">10-Day Forecast</p>
        <div className="flex flex-col gap-4">
          {['Today', 'Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-bold w-12">{day}</span>
              <Sun size={18} className="text-yellow-300" />
              <div className="flex-1 mx-4 h-1 bg-black/10 rounded-full relative overflow-hidden">
                <div className="absolute inset-y-0 left-1/4 right-1/4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
              </div>
              <span className="text-sm font-bold opacity-50">18°</span>
              <span className="text-sm font-bold w-8 text-right">26°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CameraApp = () => {
  return (
    <div className="flex-1 bg-black flex flex-col overflow-hidden relative">
      {/* Viewfinder */}
      <div className="flex-1 rounded-[3rem] overflow-hidden relative m-2">
        <img 
          src="https://picsum.photos/seed/neoos-camera/1080/1920" 
          alt="Viewfinder" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 border border-white/20 pointer-events-none" />
        
        {/* Focus Ring Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-yellow-400/50 rounded-lg" />
      </div>

      {/* Controls */}
      <div className="h-48 flex flex-col items-center justify-center gap-8">
        <div className="flex gap-8 text-[10px] font-bold opacity-40 uppercase tracking-widest">
          <span>Slo-mo</span>
          <span>Video</span>
          <span className="text-yellow-400 opacity-100">Photo</span>
          <span>Portrait</span>
          <span>Pano</span>
        </div>

        <div className="flex items-center gap-12">
          <div className="w-12 h-12 rounded-lg border-2 border-white/20 overflow-hidden">
            <img src="https://picsum.photos/seed/gallery/100/100" alt="Last Photo" referrerPolicy="no-referrer" />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => soundService.play('tap')}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1"
          >
            <div className="w-full h-full rounded-full bg-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <History size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const GalleryApp = () => {
  return (
    <div className="flex-1 bg-black overflow-y-auto no-scrollbar">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Library</h1>
          <button className="text-blue-500 font-semibold">Select</button>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => soundService.play('tap')}
              className="aspect-square bg-white/5 overflow-hidden cursor-pointer"
            >
              <img 
                src={`https://picsum.photos/seed/gallery-${i}/300/300`} 
                alt={`Photo ${i}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 glass-dark flex justify-around items-center z-10">
        <div className="flex flex-col items-center gap-1 text-blue-500"><Image size={20} /><span className="text-[9px] font-bold uppercase tracking-widest">Photos</span></div>
        <div className="flex flex-col items-center gap-1 opacity-40"><Search size={20} /><span className="text-[9px] font-bold uppercase tracking-widest">Search</span></div>
        <div className="flex flex-col items-center gap-1 opacity-40"><Grid size={20} /><span className="text-[9px] font-bold uppercase tracking-widest">Albums</span></div>
      </div>
    </div>
  );
};

const FilesApp = () => {
  const files = [
    { name: 'Documents', items: '12 items', icon: Folder, color: 'text-blue-400' },
    { name: 'Downloads', items: '4 items', icon: Folder, color: 'text-emerald-400' },
    { name: 'Images', items: '124 items', icon: Image, color: 'text-purple-400' },
    { name: 'NeoOS Backup', items: '2.4 GB', icon: Shield, color: 'text-zinc-400' },
  ];

  return (
    <div className="flex-1 bg-black overflow-y-auto no-scrollbar">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Browse</h1>
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, i) => (
            <motion.div 
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => soundService.play('tap')}
              className="glass p-5 rounded-[2rem] flex flex-col gap-4 cursor-pointer"
            >
              <file.icon size={32} className={file.color} />
              <div>
                <h3 className="font-bold">{file.name}</h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{file.items}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarApp = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const date = new Date();
  const currentDay = date.getDate();

  return (
    <div className="flex-1 bg-black p-8 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-rose-500">
          {date.toLocaleDateString([], { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-4">
          <Search size={20} className="opacity-40" />
          <Plus size={20} className="text-rose-500" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-12">
        {days.map(d => <span key={d} className="text-[10px] font-bold opacity-30 text-center uppercase tracking-widest">{d}</span>)}
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const isToday = day === currentDay;
          return (
            <div 
              key={i} 
              className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-colors ${isToday ? 'bg-rose-500 text-white' : 'hover:bg-white/5'}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Upcoming Events</p>
        <div className="flex gap-4 items-start">
          <div className="w-1 h-12 bg-rose-500 rounded-full" />
          <div>
            <h3 className="font-bold">NeoOS Launch Event</h3>
            <p className="text-xs opacity-50">10:00 AM - 12:00 PM</p>
            <p className="text-xs opacity-30">Innovation Hub</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MailApp = () => {
  const emails = [
    { from: 'NeoOS Team', subject: 'Welcome to the Future', body: 'We are excited to have you on board...', time: '9:41 AM' },
    { from: 'Cloud Services', subject: 'Storage Limit Reached', body: 'Your NeoOS Cloud storage is almost full...', time: 'Yesterday' },
    { from: 'Security Alert', subject: 'New Login Detected', body: 'A new login was detected on your account...', time: 'Tuesday' },
  ];

  return (
    <div className="flex-1 bg-black overflow-y-auto no-scrollbar">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <button className="text-blue-500 font-semibold">Edit</button>
        </div>

        <div className="flex flex-col gap-1">
          {emails.map((email, i) => (
            <motion.div 
              key={i}
              whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => soundService.play('tap')}
              className="p-4 rounded-2xl cursor-pointer border-b border-white/5"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-blue-400">{email.from}</h3>
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{email.time}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{email.subject}</h4>
              <p className="text-xs opacity-40 truncate">{email.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoApp = () => {
  return (
    <div className="flex-1 bg-black p-8 overflow-y-auto no-scrollbar">
      <h1 className="text-3xl font-bold mb-8">Library</h1>
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => soundService.play('tap')}
            className="group cursor-pointer"
          >
            <div className="aspect-video rounded-3xl bg-white/5 overflow-hidden relative mb-3">
              <img 
                src={`https://picsum.photos/seed/video-${i}/600/400`} 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play size={24} fill="white" className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold">
                12:45
              </div>
            </div>
            <h3 className="font-bold">NeoOS Cinematic Experience {i}</h3>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">2.4M Views • 2 days ago</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SecurityApp = () => {
  return (
    <div className="flex-1 bg-black p-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500/10"
          />
          <Shield size={48} className="text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">System Secure</h1>
          <p className="text-emerald-500 font-medium">All systems operational</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { name: 'Face ID', status: 'Enabled', icon: User },
          { name: 'App Privacy', status: 'Protected', icon: Lock },
          { name: 'Network Shield', status: 'Active', icon: Wifi },
          { name: 'Data Encryption', status: 'Verified', icon: Shield },
        ].map((item, i) => (
          <div key={i} className="glass p-5 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <item.icon size={20} className="opacity-50" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{item.name}</h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Last checked: Just now</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-500">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchApp = () => {
  return (
    <div className="flex-1 bg-black p-8">
      <div className="flex flex-col gap-8">
        <div className="glass h-14 rounded-2xl flex items-center px-6 gap-4">
          <Search size={20} className="opacity-40" />
          <input 
            type="text" 
            placeholder="Search NeoOS..." 
            className="bg-transparent flex-1 outline-none text-lg font-medium placeholder:opacity-30"
            autoFocus
          />
          <Mic size={20} className="opacity-40" />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Suggested</p>
          <div className="grid grid-cols-2 gap-4">
            {['Weather', 'Music', 'Settings', 'Messages'].map(app => (
              <motion.div 
                key={app}
                whileTap={{ scale: 0.95 }}
                onClick={() => soundService.play('tap')}
                className="glass p-4 rounded-2xl flex items-center gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Search size={14} className="opacity-40" />
                </div>
                <span className="font-semibold text-sm">{app}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemApp = () => {
  return (
    <div className="flex-1 bg-black p-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center">
          <Cpu size={48} className="text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Neo Core</h1>
          <p className="opacity-50">v1.0.4 (Stable Release)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass p-5 rounded-[2rem] flex flex-col gap-2">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">CPU Usage</p>
          <h2 className="text-2xl font-bold">12%</h2>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: '12%' }}
              className="h-full bg-orange-500"
            />
          </div>
        </div>
        <div className="glass p-5 rounded-[2rem] flex flex-col gap-2">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Memory</p>
          <h2 className="text-2xl font-bold">2.4 GB</h2>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: '45%' }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-6">
        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-4">System Info</p>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Model', value: 'NeoOS Pro X1' },
            { label: 'Storage', value: '256 GB (45 GB used)' },
            { label: 'Battery Health', value: '100%' },
            { label: 'Uptime', value: '12 days, 4 hours' },
          ].map((info, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm opacity-50">{info.label}</span>
              <span className="text-sm font-bold">{info.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppWindow = ({ app, onClose }: { app: AppConfig, onClose: () => void }) => {
  const renderAppContent = () => {
    switch (app.id) {
      case 'music':
        return <MusicApp />;
      case 'settings':
        return <SettingsApp />;
      case 'phone':
        return <PhoneApp />;
      case 'messages':
        return <MessagesApp />;
      case 'browser':
        return <BrowserApp />;
      case 'weather':
        return <WeatherApp />;
      case 'camera':
        return <CameraApp />;
      case 'gallery':
        return <GalleryApp />;
      case 'files':
        return <FilesApp />;
      case 'calendar':
        return <CalendarApp />;
      case 'mail':
        return <MailApp />;
      case 'video':
        return <VideoApp />;
      case 'security':
        return <SecurityApp />;
      case 'search':
        return <SearchApp />;
      case 'system':
        return <SystemApp />;
      default:
        return (
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
        );
    }
  };

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
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      {renderAppContent()}

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
                        <motion.div 
                          key={app.id} 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onAppClick(app)}
                          className={`w-full aspect-square rounded-2xl ${app.color} flex items-center justify-center shadow-md cursor-pointer`}
                        >
                          <app.icon size={20} className="text-white" />
                        </motion.div>
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
              <button 
                onClick={() => soundService.play('tap')}
                className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                "What's the weather like?"
              </button>
              <button 
                onClick={() => soundService.play('tap')}
                className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                "Open my messages"
              </button>
              <button 
                onClick={() => soundService.play('tap')}
                className="w-full py-4 rounded-2xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                "Set a timer for 5 minutes"
              </button>
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
        onClick={() => {
          soundService.play('tap');
          setIsControlCenterOpen(true);
        }}
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
            <Mic 
              size={18} 
              className="text-white/40 cursor-pointer" 
              onClick={() => {
                soundService.play('tap');
                setIsAIAssistantOpen(true);
              }} 
            />
          </div>
        </div>

        {/* Widgets Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            whileHover={{ 
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass p-5 rounded-[2rem] flex flex-col justify-between aspect-square cursor-pointer"
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
            whileHover={{ 
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass p-5 rounded-[2rem] flex flex-col justify-between aspect-square cursor-pointer"
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

