'use client';

import React from 'react';
import { cn, withRef } from '@udecode/cn';
import { PlateElement } from '@udecode/plate/react';
import { Minus } from 'lucide-react';

export const PageBreakElement = withRef<typeof PlateElement>(
  ({ className, children, ...props }, ref) => {
    return (
      <PlateElement
        ref={ref}
        className={cn(
          'relative my-6 flex items-center justify-center',
          'print:page-break-before-always print:my-0 print:h-0 print:overflow-hidden',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-center justify-center">
          <div className="flex-1 border-t border-gray-300" />
          <div className="mx-4 flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600 print:hidden">
            <Minus className="h-3 w-3" />
            <span>Page Break</span>
          </div>
          <div className="flex-1 border-t border-gray-300" />
        </div>
        {children}
      </PlateElement>
    );
  }
); 