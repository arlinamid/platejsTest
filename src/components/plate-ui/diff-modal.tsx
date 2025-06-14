'use client';

import * as React from 'react';
import { GitCompare } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/plate-ui/dialog';
import { DiffView } from '@/components/plate-ui/diff-view';
import { DiffResult } from '@/lib/diff-utils';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffResult: DiffResult | null;
  oldLabel: string;
  newLabel: string;
}

export function DiffModal({ 
  isOpen, 
  onClose, 
  diffResult, 
  oldLabel, 
  newLabel 
}: DiffModalProps) {
  if (!diffResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Version Comparison
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <DiffView
            diffResult={diffResult}
            oldLabel={oldLabel}
            newLabel={newLabel}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 