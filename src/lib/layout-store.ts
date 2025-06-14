import { create } from 'zustand';
import { PageSetupConfig } from '@/components/plate-ui/page-setup';

interface LayoutState {
  showRuler: boolean;
  showPageSetup: boolean;
  layoutMode: 'page' | 'web';
  multiPageMode: boolean;
  showIndexSidebar: boolean;
  pageConfig: PageSetupConfig;
  toggleRuler: () => void;
  togglePageSetup: () => void;
  toggleLayoutMode: () => void;
  toggleMultiPageMode: () => void;
  setShowIndexSidebar: (show: boolean) => void;
  setPageConfig: (config: PageSetupConfig) => void;
}

const defaultPageConfig: PageSetupConfig = {
  paperSize: 'letter',
  orientation: 'portrait',
  margins: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  },
  width: 8.5,
  height: 11,
  unit: 'in',
};

export const useLayoutStore = create<LayoutState>((set) => ({
  showRuler: true,
  showPageSetup: false,
  layoutMode: 'page',
  multiPageMode: false,
  showIndexSidebar: false,
  pageConfig: defaultPageConfig,
  toggleRuler: () => set((state) => ({ showRuler: !state.showRuler })),
  togglePageSetup: () => set((state) => ({ showPageSetup: !state.showPageSetup })),
  toggleLayoutMode: () => set((state) => ({ 
    layoutMode: state.layoutMode === 'page' ? 'web' : 'page' 
  })),
  toggleMultiPageMode: () => set((state) => ({ multiPageMode: !state.multiPageMode })),
  setShowIndexSidebar: (show) => set({ showIndexSidebar: show }),
  setPageConfig: (config) => set({ pageConfig: config }),
})); 