'use client';

import { createPlatePlugin } from '@udecode/plate/react';

export const PAGE_BREAK_KEY = 'page_break';

export const PageBreakPlugin = createPlatePlugin({
  key: PAGE_BREAK_KEY,
  node: {
    isElement: true,
    isVoid: true,
  },
}); 