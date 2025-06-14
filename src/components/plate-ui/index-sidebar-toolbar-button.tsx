'use client';

import React from 'react';
import { List } from 'lucide-react';
import { ToolbarButton } from '@/components/plate-ui/toolbar';
import { useLayoutStore } from '@/lib/layout-store';

export function IndexSidebarToolbarButton() {
  const { showIndexSidebar, setShowIndexSidebar } = useLayoutStore();

  return (
    <ToolbarButton
      pressed={showIndexSidebar}
      onClick={() => setShowIndexSidebar(!showIndexSidebar)}
      tooltip="Toggle Table of Contents"
    >
      <List className="h-4 w-4" />
    </ToolbarButton>
  );
} 