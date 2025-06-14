'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import { SettingsDialog } from '@/components/editor/settings';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { LayoutWrapper } from '@/components/plate-ui/layout-wrapper';
import { MultiPageLayout } from '@/components/plate-ui/multi-page-layout';
import { EnhancedMultiPageLayout } from '@/components/plate-ui/enhanced-multi-page-layout';
import { IndexSidebar } from '@/components/plate-ui/index-sidebar';
import { Toolbar } from '@/components/plate-ui/toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { useLayoutStore } from '@/lib/layout-store';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { 
    showRuler, 
    showPageSetup, 
    layoutMode, 
    multiPageMode,
    showIndexSidebar,
    setShowIndexSidebar,
    pageConfig, 
    setPageConfig 
  } = useLayoutStore();

  // If in web layout mode, just render children without wrapper
  if (layoutMode === 'web') {
    return <div className="flex-1 h-full overflow-auto">{children}</div>;
  }

  // In page layout mode, choose between single and multi-page layout
  const LayoutComponent = multiPageMode ? EnhancedMultiPageLayout : LayoutWrapper;
  
  return (
    <LayoutComponent
      config={pageConfig}
      onConfigChange={setPageConfig}
      showRuler={showRuler}
      showPageSetup={showPageSetup}
    >
      {children}
    </LayoutComponent>
  );
}

function EditorWithLayout() {
  const { layoutMode } = useLayoutStore();
  
  return (
    <EditorContainer variant={layoutMode === 'page' ? 'default' : 'demo'}>
      <Editor 
        variant={layoutMode === 'page' ? 'none' : 'demo'} 
        className={layoutMode === 'page' ? 'p-4 h-full w-full max-w-none' : undefined}
      />
    </EditorContainer>
  );
}

export function PlateEditor() {
  const editor = useCreateEditor();
  const { showIndexSidebar, setShowIndexSidebar } = useLayoutStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <div className="h-full flex flex-col">
          {/* Fixed Toolbar - always at the top with proper z-index */}
          <div className="flex-shrink-0 relative z-50 bg-background border-b border-border">
            <Toolbar className="w-full justify-between overflow-x-auto bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60">
              <FixedToolbarButtons />
            </Toolbar>
          </div>
          
          {/* Main Content Area with Sidebar */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Layout Provider - contains ruler and page layout */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showIndexSidebar ? 'mr-80' : ''}`}>
              <LayoutProvider>
                <EditorWithLayout />
              </LayoutProvider>
            </div>
            
            {/* Index Sidebar */}
            <IndexSidebar 
              isOpen={showIndexSidebar} 
              onClose={() => setShowIndexSidebar(false)} 
            />
          </div>
        </div>

        <SettingsDialog />
      </Plate>
    </DndProvider>
  );
}
