import type { ComponentType, ReactNode } from 'react';
import MyComputer from '@/components/apps/MyComputer';
import RecycleBin from '@/components/apps/RecycleBin';
import Notepad from '@/components/apps/Notepad';
import Paint from '@/components/apps/Paint';
import Browser from '@/components/apps/Browser';
import Minesweeper from '@/components/apps/Minesweeper';

export interface AppWindowConfig {
  title: string;
  icon: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

export interface AppDesktopIcon {
  x: number;
  y: number;
}

export interface AppRegistration {
  id: string;
  title: string;
  icon: string;
  windowConfig: Omit<AppWindowConfig, 'title' | 'icon'>;
  desktopIcon?: AppDesktopIcon;
  showInStartMenu?: boolean;
  component: ComponentType<{ windowId: string }>;
}

const appRegistry: AppRegistration[] = [
  {
    id: 'mycomputer',
    title: '我的电脑',
    icon: '💻',
    windowConfig: {
      width: 600,
      height: 400,
      minWidth: 400,
      minHeight: 300,
    },
    desktopIcon: { x: 20, y: 20 },
    showInStartMenu: true,
    component: MyComputer,
  },
  {
    id: 'recyclebin',
    title: '回收站',
    icon: '🗑️',
    windowConfig: {
      width: 500,
      height: 350,
      minWidth: 350,
      minHeight: 250,
    },
    desktopIcon: { x: 20, y: 110 },
    showInStartMenu: true,
    component: RecycleBin,
  },
  {
    id: 'notepad',
    title: '记事本',
    icon: '📝',
    windowConfig: {
      width: 500,
      height: 400,
      minWidth: 300,
      minHeight: 200,
    },
    desktopIcon: { x: 20, y: 200 },
    showInStartMenu: true,
    component: Notepad,
  },
  {
    id: 'paint',
    title: '画图',
    icon: '🎨',
    windowConfig: {
      width: 700,
      height: 500,
      minWidth: 400,
      minHeight: 300,
    },
    desktopIcon: { x: 20, y: 290 },
    showInStartMenu: true,
    component: Paint,
  },
  {
    id: 'browser',
    title: '浏览器',
    icon: '🌐',
    windowConfig: {
      width: 700,
      height: 500,
      minWidth: 400,
      minHeight: 300,
    },
    desktopIcon: { x: 20, y: 380 },
    showInStartMenu: true,
    component: Browser,
  },
  {
    id: 'minesweeper',
    title: '扫雷',
    icon: '💣',
    windowConfig: {
      width: 350,
      height: 420,
      minWidth: 250,
      minHeight: 320,
    },
    desktopIcon: { x: 20, y: 470 },
    showInStartMenu: true,
    component: Minesweeper,
  },
];

export type AppId = typeof appRegistry[number]['id'];

export const getAppIds = (): AppId[] => appRegistry.map((app) => app.id as AppId);

export const getAppConfig = (id: AppId): AppRegistration | undefined =>
  appRegistry.find((app) => app.id === id);

export const getAppWindowConfig = (id: AppId): AppWindowConfig => {
  const app = getAppConfig(id);
  if (!app) {
    return {
      title: id,
      icon: '📄',
      width: 500,
      height: 400,
      minWidth: 300,
      minHeight: 200,
    };
  }
  return {
    title: app.title,
    icon: app.icon,
    ...app.windowConfig,
  };
};

export const getAppRenderers = (): Record<AppId, (windowId: string) => ReactNode> => {
  const renderers = {} as Record<AppId, (windowId: string) => ReactNode>;
  appRegistry.forEach((app) => {
    const Component = app.component;
    renderers[app.id as AppId] = (windowId: string) => <Component windowId={windowId} />;
  });
  return renderers;
};

export const getDesktopIcons = () =>
  appRegistry
    .filter((app) => app.desktopIcon)
    .map((app) => ({
      id: `icon-${app.id}`,
      appId: app.id as AppId,
      label: app.title,
      icon: app.icon,
      x: app.desktopIcon!.x,
      y: app.desktopIcon!.y,
    }));

export const getStartMenuItems = () =>
  appRegistry
    .filter((app) => app.showInStartMenu)
    .map((app) => ({
      appId: app.id as AppId,
      icon: app.icon,
      label: app.title,
    }));

export default appRegistry;
