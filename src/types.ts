import { LucideIcon } from 'lucide-react';

export type AppConfig = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  category: 'System' | 'Social' | 'Media' | 'Utilities' | 'Games';
  isSystem?: boolean;
};

export type WidgetConfig = {
  id: string;
  type: 'weather' | 'battery' | 'calendar' | 'music';
  size: 'small' | 'medium' | 'large';
};

export type OSState = {
  isLocked: boolean;
  isControlCenterOpen: boolean;
  activeAppId: string | null;
  batteryLevel: number;
  currentTime: Date;
  notifications: Notification[];
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  appId: string;
  timestamp: Date;
};
