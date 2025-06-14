'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@udecode/cn';
import { Ruler } from './ruler';
import { PageSetup, type PageSetupConfig } from './page-setup';

interface MultiPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  config: PageSetupConfig;
  onConfigChange: (config: PageSetupConfig) => void;
  showRuler?: boolean;
  showPageSetup?: boolean;
}

export function MultiPageLayout({
  children,
  className,
  config,
  onConfigChange,
  showRuler = true,
  showPageSetup = true,
}: MultiPageLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  // Convert margins based on unit and DPI
  const getDPI = () => config.unit === 'in' ? 96 : config.unit === 'cm' ? 37.8 : 1;
  const dpi = getDPI();
  
  const marginTopPx = config.margins.top * dpi;
  const marginBottomPx = config.margins.bottom * dpi;
  const marginLeftPx = config.margins.left * dpi;
  const marginRightPx = config.margins.right * dpi;
  
  const pageWidthPx = (config.width || 8.5) * dpi;
  const pageHeightPx = (config.height || 11) * dpi;
  
  // Calculate content area dimensions
  const contentWidthPx = pageWidthPx - marginLeftPx - marginRightPx;
  const contentHeightPx = pageHeightPx - marginTopPx - marginBottomPx;

  // Calculate page count based on content height
  const calculatePageCount = useCallback(() => {
    if (!contentRef.current) return;
    
    setIsCalculating(true);
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const pagesNeeded = Math.max(1, Math.ceil(contentHeight / contentHeightPx));
        setPageCount(pagesNeeded);
      }
      setIsCalculating(false);
    });
  }, [contentHeightPx]);

  // Recalculate when content or dimensions change
  useEffect(() => {
    calculatePageCount();
  }, [calculatePageCount, children]);

  // Use ResizeObserver to detect content changes
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      calculatePageCount();
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculatePageCount]);

  return (
    <div className={cn('flex flex-col bg-gray-100 h-full', className)}>
      {/* Toolbar with Page Setup */}
      {showPageSetup && (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0 relative z-40">
          <div className="flex items-center gap-4">
            <PageSetup config={config} onChange={onConfigChange} />
            <div className="text-sm text-gray-600">
              {config.paperSize.toUpperCase()} • {config.orientation} • {config.unit} • {pageCount} page{pageCount !== 1 ? 's' : ''}
              {isCalculating && ' (calculating...)'}
            </div>
          </div>
        </div>
      )}

      {/* Ruler */}
      {showRuler && (
        <div className="flex justify-center bg-gray-100 z-10 flex-shrink-0">
          <Ruler
            width={pageWidthPx}
            unit={config.unit}
            showMargins={true}
            marginLeft={marginLeftPx}
            marginRight={marginRightPx}
          />
        </div>
      )}

      {/* Pages Container */}
      <div className="flex-1 py-8 overflow-auto bg-gray-100">
        <div className="flex justify-center">
          <div className="flex flex-col gap-8">
            {/* Render multiple pages */}
            {Array.from({ length: pageCount }, (_, pageIndex) => (
              <div
                key={pageIndex}
                className="bg-white shadow-lg relative print:shadow-none"
                style={{
                  width: pageWidthPx,
                  height: pageHeightPx,
                  padding: `${marginTopPx}px ${marginRightPx}px ${marginBottomPx}px ${marginLeftPx}px`,
                }}
              >
                {/* Content viewport for this page */}
                <div 
                  className="relative overflow-hidden"
                  style={{
                    width: contentWidthPx,
                    height: contentHeightPx,
                  }}
                >
                  {/* Content container - only render once in first page */}
                  {pageIndex === 0 && (
                    <div
                      ref={contentRef}
                      className="absolute top-0 left-0"
                      style={{
                        width: contentWidthPx,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      <div className="w-full [&_.slate-editor]:p-4 [&_.slate-editor]:h-full [&_.slate-editor]:w-full [&_.slate-editor]:max-w-none [&_.slate-editor]:px-0 [&_.slate-editor]:pt-0 [&_.slate-editor]:pb-0">
                        {children}
                      </div>
                    </div>
                  )}
                  
                  {/* For subsequent pages, show content with offset */}
                  {pageIndex > 0 && (
                    <div
                      className="absolute top-0 left-0"
                      style={{
                        width: contentWidthPx,
                        transform: `translateY(-${pageIndex * contentHeightPx}px)`,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {/* Clone the content for subsequent pages */}
                      <div style={{ width: contentWidthPx }} className="[&_.slate-editor]:p-4 [&_.slate-editor]:h-full [&_.slate-editor]:w-full [&_.slate-editor]:max-w-none [&_.slate-editor]:px-0 [&_.slate-editor]:pt-0 [&_.slate-editor]:pb-0">
                        {children}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Page number */}
                <div className="absolute bottom-2 right-4 text-xs text-gray-400 print:text-black">
                  Page {pageIndex + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Info Footer */}
      <div className="p-2 bg-white border-t border-gray-200 text-xs text-gray-500 text-center print:hidden flex-shrink-0">
        Page Size: {pageWidthPx.toFixed(0)}×{pageHeightPx.toFixed(0)}px 
        | Content Area: {contentWidthPx.toFixed(0)}×{contentHeightPx.toFixed(0)}px
        | Margins: {config.margins.top}{config.unit} {config.margins.right}{config.unit} {config.margins.bottom}{config.unit} {config.margins.left}{config.unit}
        | Pages: {pageCount}
      </div>
    </div>
  );
} 