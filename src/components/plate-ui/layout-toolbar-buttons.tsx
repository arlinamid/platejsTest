'use client';

import React from 'react';
import { Ruler, Settings, Layout, FileText } from 'lucide-react';

import { ToolbarButton } from '@/components/plate-ui/toolbar';
import { useLayoutStore } from '@/lib/layout-store';

export function RulerToggleButton() {
  const { showRuler, toggleRuler } = useLayoutStore();

  return (
    <ToolbarButton
      pressed={showRuler}
      onClick={toggleRuler}
      tooltip="Toggle Ruler"
    >
      <Ruler className="h-4 w-4" />
    </ToolbarButton>
  );
}

export function PageSetupButton() {
  const { showPageSetup, togglePageSetup } = useLayoutStore();

  return (
    <ToolbarButton
      pressed={showPageSetup}
      onClick={togglePageSetup}
      tooltip="Page Setup"
    >
      <Settings className="h-4 w-4" />
    </ToolbarButton>
  );
}

export function LayoutToggleButton() {
  const { layoutMode, toggleLayoutMode } = useLayoutStore();

  return (
    <ToolbarButton
      pressed={layoutMode === 'page'}
      onClick={toggleLayoutMode}
      tooltip={layoutMode === 'page' ? 'Switch to Web Layout' : 'Switch to Page Layout'}
    >
      <Layout className="h-4 w-4" />
    </ToolbarButton>
  );
}

export function MultiPageToggleButton() {
  const { multiPageMode, toggleMultiPageMode, layoutMode } = useLayoutStore();

  // Only show when in page layout mode
  if (layoutMode !== 'page') {
    return null;
  }

  return (
    <ToolbarButton
      pressed={multiPageMode}
      onClick={toggleMultiPageMode}
      tooltip={multiPageMode ? 'Switch to Single Page' : 'Switch to Multi-Page'}
    >
      <FileText className="h-4 w-4" />
    </ToolbarButton>
  );
} 