'use client';

import * as React from 'react';
import { Change } from 'diff';
import { cn } from '@udecode/cn';
import { X, GitCompare, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/plate-ui/button';
import { DiffResult } from '@/lib/diff-utils';

interface DiffViewProps {
  diffResult: DiffResult;
  oldLabel: string;
  newLabel: string;
  onClose?: () => void;
  className?: string;
}

interface DiffLineProps {
  change: Change;
  index: number;
}

function DiffLine({ change, index }: DiffLineProps) {
  const getLineClass = () => {
    if (change.added) return 'bg-green-50 border-l-4 border-green-400 text-green-800';
    if (change.removed) return 'bg-red-50 border-l-4 border-red-400 text-red-800';
    return 'bg-gray-50';
  };

  const getPrefix = () => {
    if (change.added) return '+ ';
    if (change.removed) return '- ';
    return '  ';
  };

  return (
    <div
      key={index}
      className={cn(
        'px-4 py-2 font-mono text-sm whitespace-pre-wrap',
        getLineClass()
      )}
    >
      <span className="select-none text-gray-400 mr-2">{getPrefix()}</span>
      {change.value}
    </div>
  );
}

export function DiffView({ 
  diffResult, 
  oldLabel, 
  newLabel, 
  onClose, 
  className 
}: DiffViewProps) {
  const [showUnchanged, setShowUnchanged] = React.useState(false);

  const filteredChanges = React.useMemo(() => {
    if (showUnchanged) {
      return diffResult.changes;
    }
    return diffResult.changes.filter(change => change.added || change.removed);
  }, [diffResult.changes, showUnchanged]);

  if (!diffResult.hasChanges) {
    return (
      <div className={cn("p-6 bg-white border rounded-lg", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Comparison</h3>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No differences found</div>
          <div className="text-sm text-gray-400">
            The content in both revisions is identical
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Comparison</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowUnchanged(!showUnchanged)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {showUnchanged ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showUnchanged ? 'Hide unchanged' : 'Show unchanged'}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Info */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Comparing:</span>
            <span className="font-medium text-red-600">{oldLabel}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium text-green-600">{newLabel}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {diffResult.addedCount > 0 && (
              <span className="text-green-600">+{diffResult.addedCount} added</span>
            )}
            {diffResult.removedCount > 0 && (
              <span className="text-red-600">-{diffResult.removedCount} removed</span>
            )}
          </div>
        </div>
      </div>

      {/* Diff Content */}
      <div className="max-h-96 overflow-y-auto">
        {filteredChanges.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No {showUnchanged ? '' : 'changed '}content to display
          </div>
        ) : (
          <div className="divide-y">
            {filteredChanges.map((change, index) => (
              <DiffLine key={index} change={change} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border-l-2 border-green-400 rounded-sm"></div>
            <span>Added</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border-l-2 border-red-400 rounded-sm"></div>
            <span>Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <span>Unchanged</span>
          </div>
        </div>
      </div>
    </div>
  );
} 