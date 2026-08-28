import { NAV_CONFIG, NavGroup, NavItem } from '../constant';
import { useLocalStorage } from './use-local-storage';

export const PINNED_TOOLS_KEY = 'pinned-tools';

export const usePinnedTools = () => {
  const [pinnedTools, setPinnedTools] = useLocalStorage<string[]>(
    PINNED_TOOLS_KEY,
    [],
  );

  const hasPinnedTool = (toolId: string) => {
    return pinnedTools.includes(toolId);
  };

  const togglePinnedTool = (toolId: string) => {
    setPinnedTools((prev: string[]) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      return [...prev, toolId];
    });
  };

  const navPin = () => {
    const pinnedItems = NAV_CONFIG.navMain.flatMap(
      (group) =>
        group.items?.filter((item) => pinnedTools.includes(item.key)) ?? [],
    );

    const tools: NavGroup = {
      title: 'Pinned',
      items: pinnedItems as NavItem[],
    };

    return tools;
  };

  return { pinnedTools, hasPinnedTool, togglePinnedTool, navPin };
};
