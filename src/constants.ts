import { 
  Phone, 
  MessageSquare, 
  Camera, 
  Image, 
  Folder, 
  Globe, 
  Settings, 
  Music, 
  Calendar, 
  Mail,
  Play,
  Cloud,
  Shield,
  Search,
  Cpu,
  Battery,
  Wifi,
  Signal
} from 'lucide-react';
import { AppConfig } from './types';

export const SYSTEM_APPS: AppConfig[] = [
  { id: 'phone', name: 'Phone', icon: Phone, color: 'bg-emerald-500', category: 'System', isSystem: true },
  { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-blue-500', category: 'System', isSystem: true },
  { id: 'camera', name: 'Camera', icon: Camera, color: 'bg-zinc-800', category: 'System', isSystem: true },
  { id: 'gallery', name: 'Gallery', icon: Image, color: 'bg-gradient-to-br from-purple-500 to-pink-500', category: 'System', isSystem: true },
  { id: 'files', name: 'Files', icon: Folder, color: 'bg-blue-400', category: 'System', isSystem: true },
  { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-sky-500', category: 'System', isSystem: true },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-zinc-500', category: 'System', isSystem: true },
  { id: 'music', name: 'Music', icon: Music, color: 'bg-rose-500', category: 'Media' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-white text-rose-500', category: 'Utilities' },
  { id: 'mail', name: 'Mail', icon: Mail, color: 'bg-blue-600', category: 'Utilities' },
  { id: 'video', name: 'Video', icon: Play, color: 'bg-indigo-500', category: 'Media' },
  { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-400', category: 'Utilities' },
  { id: 'security', name: 'Security', icon: Shield, color: 'bg-emerald-600', category: 'System' },
  { id: 'search', name: 'Search', icon: Search, color: 'bg-zinc-400', category: 'Utilities' },
  { id: 'system', name: 'System', icon: Cpu, color: 'bg-orange-500', category: 'System' },
];

export const COLORS = {
  primary: '#007AFF',
  background: '#000000',
  surface: 'rgba(255, 255, 255, 0.1)',
  glass: 'rgba(255, 255, 255, 0.2)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
};
