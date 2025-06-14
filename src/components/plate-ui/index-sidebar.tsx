'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@udecode/cn';
import { 
  List, 
  ChevronRight, 
  ChevronDown, 
  Hash,
  X
} from 'lucide-react';
import { Button } from '@/components/plate-ui/button';
import { useHeadings } from '@/hooks/use-headings';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  children: HeadingItem[];
}

interface IndexSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function IndexSidebar({ isOpen, onClose, className }: IndexSidebarProps) {
  const headings = useHeadings();
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand all items when headings change
  useEffect(() => {
    const allIds = new Set<string>();
    const collectIds = (items: HeadingItem[]) => {
      items.forEach(item => {
        allIds.add(item.id);
        collectIds(item.children);
      });
    };
    collectIds(headings);
    setExpandedItems(allIds);
  }, [headings]);

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('[data-slate-editor="true"] h1, [data-slate-editor="true"] h2, [data-slate-editor="true"] h3, [data-slate-editor="true"] h4, [data-slate-editor="true"] h5, [data-slate-editor="true"] h6');
      let currentActive: string | null = null;

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 0) {
          currentActive = element.id;
        }
      });

      setActiveHeading(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveHeading(id);
    }
  };

  // Toggle expanded state
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Render heading item
  const renderHeadingItem = (item: HeadingItem, depth = 0) => {
    const isActive = activeHeading === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children.length > 0;

    return (
      <div key={item.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors',
            isActive && 'bg-blue-100 text-blue-700 font-medium',
            depth > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {!hasChildren && <div className="w-4" />}
          
          <Hash className={cn(
            'h-3 w-3 flex-shrink-0',
            item.level === 1 && 'text-blue-600',
            item.level === 2 && 'text-green-600',
            item.level === 3 && 'text-orange-600',
            item.level >= 4 && 'text-gray-600'
          )} />
          
          <span
            className={cn(
              'flex-1 truncate',
              item.level === 1 && 'font-semibold',
              item.level === 2 && 'font-medium'
            )}
            onClick={() => scrollToHeading(item.id)}
            title={item.text}
          >
            {item.text || `Heading ${item.level}`}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children.map(child => renderHeadingItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      'fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Table of Contents</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {headings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Hash className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No headings found</p>
            <p className="text-xs text-gray-400 mt-1">
              Add H1, H2, H3 headings to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {headings.map(heading => renderHeadingItem(heading))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Total headings:</span>
            <span className="font-medium">{headings.length}</span>
          </div>
          <div className="text-gray-400">
            Click headings to navigate • Auto-updates
          </div>
        </div>
      </div>
    </div>
  );
} 