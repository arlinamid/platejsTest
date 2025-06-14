import { useEffect, useState, useCallback, useRef } from 'react';
import { useEditorRef } from '@udecode/plate/react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  children: HeadingItem[];
}

export function useHeadings() {
  const editor = useEditorRef();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const lastUpdateTimeRef = useRef(0);

  // Extract headings from the editor content
  const extractHeadings = useCallback(() => {
    const headingElements = document.querySelectorAll('[data-slate-editor="true"] h1, [data-slate-editor="true"] h2, [data-slate-editor="true"] h3, [data-slate-editor="true"] h4, [data-slate-editor="true"] h5, [data-slate-editor="true"] h6');
    const headingItems: HeadingItem[] = [];
    const stack: HeadingItem[] = [];

    headingElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.charAt(1));
      const text = element.textContent?.trim() || '';
      
      // Skip empty headings
      if (!text) return;
      
      const id = element.id || `heading-${index}-${Date.now()}`;
      
      // Ensure element has an ID for scrolling
      if (!element.id) {
        element.id = id;
      }

      const headingItem: HeadingItem = {
        id,
        text,
        level,
        element: element as HTMLElement,
        children: [],
      };

      // Build hierarchical structure
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        headingItems.push(headingItem);
      } else {
        stack[stack.length - 1].children.push(headingItem);
      }

      stack.push(headingItem);
    });

    return headingItems;
  }, []);

  // Update headings with throttling using ref to avoid dependency issues
  const updateHeadings = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 100) return; // Throttle updates
    
    const newHeadings = extractHeadings();
    setHeadings(newHeadings);
    lastUpdateTimeRef.current = now;
  }, [extractHeadings]);

  // Create a stable reference to updateHeadings
  const updateHeadingsRef = useRef(updateHeadings);
  updateHeadingsRef.current = updateHeadings;

  // Listen for editor changes
  useEffect(() => {
    if (!editor) return;

    // Create a stable function that calls the current updateHeadings
    const stableUpdateHeadings = () => updateHeadingsRef.current();

    // Initial update
    const initialTimer = setTimeout(stableUpdateHeadings, 100);

    // Set up observers
    const observers: (() => void)[] = [];

    // 1. MutationObserver for DOM changes (primary detection method)
    const mutationObserver = new MutationObserver(() => {
      setTimeout(stableUpdateHeadings, 50);
    });

    const editorElement = document.querySelector('[data-slate-editor="true"]');
    if (editorElement) {
      mutationObserver.observe(editorElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      observers.push(() => mutationObserver.disconnect());
    }

    // 2. Periodic updates as fallback (reduced frequency)
    const interval = setInterval(stableUpdateHeadings, 5000);
    observers.push(() => clearInterval(interval));

    return () => {
      clearTimeout(initialTimer);
      observers.forEach(cleanup => cleanup());
    };
  }, [editor]);

  return headings;
} 