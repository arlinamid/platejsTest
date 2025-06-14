'use client';

import React from 'react';
import { createPlatePlugin } from '@udecode/plate/react';

import { LayoutWrapper } from '@/components/plate-ui/layout-wrapper';
import { MultiPageLayout } from '@/components/plate-ui/multi-page-layout';
import { useLayoutStore } from '@/lib/layout-store';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { 
    showRuler, 
    showPageSetup, 
    layoutMode, 
    multiPageMode,
    pageConfig, 
    setPageConfig 
  } = useLayoutStore();

  // If in web layout mode, just render children without wrapper
  if (layoutMode === 'web') {
    return <>{children}</>;
  }

  // In page layout mode, choose between single and multi-page layout
  const LayoutComponent = multiPageMode ? MultiPageLayout : LayoutWrapper;
  
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

export const LayoutPlugin = createPlatePlugin({
  key: 'layout',
  render: {
    beforeEditable: ({ children }) => (
      <LayoutProvider>{children}</LayoutProvider>
    ),
  },
}); 