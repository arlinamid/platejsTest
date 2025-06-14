'use client';

import React, { useState } from 'react';
import { cn } from '@udecode/cn';
import { Settings, FileText, Ruler, Layout } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
// Using simpler HTML elements instead of complex UI components

export interface PageSetupConfig {
  paperSize: 'letter' | 'a4' | 'legal' | 'custom';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  width?: number;
  height?: number;
  unit: 'px' | 'in' | 'cm';
}

interface PageSetupProps {
  config: PageSetupConfig;
  onChange: (config: PageSetupConfig) => void;
  className?: string;
}

const PAPER_SIZES = {
  letter: { width: 8.5, height: 11, unit: 'in' as const },
  a4: { width: 21, height: 29.7, unit: 'cm' as const },
  legal: { width: 8.5, height: 14, unit: 'in' as const },
  custom: { width: 8.5, height: 11, unit: 'in' as const },
};

export function PageSetup({ config, onChange, className }: PageSetupProps) {
  const [open, setOpen] = useState(false);

  const handlePaperSizeChange = (paperSize: keyof typeof PAPER_SIZES) => {
    const size = PAPER_SIZES[paperSize];
    const newConfig = {
      ...config,
      paperSize,
      unit: size.unit,
      width: config.orientation === 'landscape' ? size.height : size.width,
      height: config.orientation === 'landscape' ? size.width : size.height,
    };
    onChange(newConfig);
  };

  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    const newConfig = {
      ...config,
      orientation,
      width: orientation === 'landscape' ? config.height : config.width,
      height: orientation === 'landscape' ? config.width : config.height,
    };
    onChange(newConfig);
  };

  const handleMarginChange = (side: keyof PageSetupConfig['margins'], value: number) => {
    onChange({
      ...config,
      margins: {
        ...config.margins,
        [side]: value,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Settings className="h-4 w-4 mr-2" />
          Page Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Page Setup
          </DialogTitle>
          <DialogDescription>
            Configure page size, orientation, and margins for your document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="paper-size" className="text-sm font-medium">Paper Size</label>
            <select
              id="paper-size"
              value={config.paperSize}
              onChange={(e) => handlePaperSizeChange(e.target.value as keyof typeof PAPER_SIZES)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="letter">Letter (8.5" × 11")</option>
              <option value="a4">A4 (21cm × 29.7cm)</option>
              <option value="legal">Legal (8.5" × 14")</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="orientation" className="text-sm font-medium">Orientation</label>
            <select
              id="orientation"
              value={config.orientation}
              onChange={(e) => handleOrientationChange(e.target.value as 'portrait' | 'landscape')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {config.paperSize === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="width" className="text-sm font-medium">Width</label>
                <input
                  id="width"
                  type="number"
                  value={config.width || 8.5}
                  onChange={(e) => onChange({
                    ...config,
                    width: parseFloat(e.target.value),
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-medium">Height</label>
                <input
                  id="height"
                  type="number"
                  value={config.height || 11}
                  onChange={(e) => onChange({
                    ...config,
                    height: parseFloat(e.target.value),
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-4">Margins ({config.unit})</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="margin-top" className="text-sm font-medium">Top</label>
                <input
                  id="margin-top"
                  type="number"
                  value={config.margins.top}
                  onChange={(e) => handleMarginChange('top', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="margin-bottom" className="text-sm font-medium">Bottom</label>
                <input
                  id="margin-bottom"
                  type="number"
                  value={config.margins.bottom}
                  onChange={(e) => handleMarginChange('bottom', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="margin-left" className="text-sm font-medium">Left</label>
                <input
                  id="margin-left"
                  type="number"
                  value={config.margins.left}
                  onChange={(e) => handleMarginChange('left', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="margin-right" className="text-sm font-medium">Right</label>
                <input
                  id="margin-right"
                  type="number"
                  value={config.margins.right}
                  onChange={(e) => handleMarginChange('right', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 