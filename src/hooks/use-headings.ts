import { useEffect, useState, useCallback } from 'react';
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
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

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

  // Update headings with throttling
  const updateHeadings = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateTime < 100) return; // Throttle updates
    
    const newHeadings = extractHeadings();
    setHeadings(newHeadings);
    setLastUpdateTime(now);
  }, [extractHeadings, lastUpdateTime]);

  // Listen for editor changes
  useEffect(() => {
    if (!editor) return;

    // Initial update
    setTimeout(updateHeadings, 100);

    // Listen for editor value changes
    const unsubscribe = editor.api.redecorate();

    // Set up multiple listeners for different types of changes
    const observers: (() => void)[] = [];

    // 1. MutationObserver for DOM changes
    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateHeadings, 50);
    });

    const editorElement = document.querySelector('[data-slate-editor="true"]');
    if (editorElement) {
      mutationObserver.observe(editorElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
      observers.push(() => mutationObserver.disconnect());
    }

    // 2. Keyboard event listeners
    const handleKeyUp = () => setTimeout(updateHeadings, 100);
    document.addEventListener('keyup', handleKeyUp);
    observers.push(() => document.removeEventListener('keyup', handleKeyUp));

    // 3. Input event listeners
    const handleInput = () => setTimeout(updateHeadings, 100);
    if (editorElement) {
      editorElement.addEventListener('input', handleInput);
      observers.push(() => editorElement.removeEventListener('input', handleInput));
    }

    // 4. Focus/blur events
    const handleFocusChange = () => setTimeout(updateHeadings, 200);
    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('focusout', handleFocusChange);
    observers.push(() => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('focusout', handleFocusChange);
    });

    // 5. Periodic updates as fallback
    const interval = setInterval(updateHeadings, 3000);
    observers.push(() => clearInterval(interval));

    return () => {
      observers.forEach(cleanup => cleanup());
    };
  }, [editor, updateHeadings]);

  return headings;
} 