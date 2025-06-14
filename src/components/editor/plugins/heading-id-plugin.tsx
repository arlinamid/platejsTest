'use client';

import { createPlatePlugin } from '@udecode/plate/react';
import { HEADING_KEYS } from '@udecode/plate-heading';

// Function to generate slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export const HeadingIdPlugin = createPlatePlugin({
  key: 'heading-id',
  handlers: {
    onChange: ({ editor }) => {
      // Add IDs to heading elements after content changes
      setTimeout(() => {
        const headingElements = document.querySelectorAll('[data-slate-editor="true"] h1, [data-slate-editor="true"] h2, [data-slate-editor="true"] h3, [data-slate-editor="true"] h4, [data-slate-editor="true"] h5, [data-slate-editor="true"] h6');
        const usedIds = new Set<string>();
        
        headingElements.forEach((element, index) => {
          const text = element.textContent?.trim() || '';
          
          // Skip empty headings
          if (!text) return;
          
          let baseId = generateSlug(text) || `heading-${index}`;
          let finalId = baseId;
          let counter = 1;
          
          // Ensure unique IDs
          while (usedIds.has(finalId)) {
            finalId = `${baseId}-${counter}`;
            counter++;
          }
          
          usedIds.add(finalId);
          element.id = finalId;
        });
      }, 150);
    },
  },
}); 