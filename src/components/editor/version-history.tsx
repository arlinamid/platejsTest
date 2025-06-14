'use client';

import * as React from 'react';
import { cloneDeep } from 'lodash';
import { Save, History, GitBranch, Clock, Trash2 } from 'lucide-react';

import { Button } from '@/components/plate-ui/button';
import { cn } from '@/lib/utils';

interface Revision {
  id: string;
  value: any;
  timestamp: Date;
  label?: string;
}

interface VersionHistoryProps {
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

export default function VersionHistory({ 
  value, 
  onChange,
  className 
}: VersionHistoryProps) {
  const [revisions, setRevisions] = React.useState<Revision[]>([
    {
      id: '1',
      value: [
        {
          type: 'p',
          children: [{ text: 'Welcome to your editor with version history!' }],
        },
      ],
      timestamp: new Date(),
      label: 'Initial version',
    }
  ]);
  const [selectedRevisionIndex, setSelectedRevisionIndex] = React.useState<number>(0);

  const selectedRevision = React.useMemo(
    () => revisions[selectedRevisionIndex],
    [revisions, selectedRevisionIndex]
  );

  const saveRevision = () => {
    const newRevision: Revision = {
      id: Date.now().toString(),
      value: cloneDeep(value),
      timestamp: new Date(),
      label: `Revision ${revisions.length + 1}`,
    };
    setRevisions([...revisions, newRevision]);
  };

  const restoreRevision = (revision: Revision) => {
    onChange(cloneDeep(revision.value));
  };

  const deleteRevision = (index: number) => {
    if (revisions.length <= 1) return;
    
    const newRevisions = revisions.filter((_, i) => i !== index);
    setRevisions(newRevisions);
    
    if (selectedRevisionIndex >= newRevisions.length) {
      setSelectedRevisionIndex(newRevisions.length - 1);
    } else if (selectedRevisionIndex > index) {
      setSelectedRevisionIndex(selectedRevisionIndex - 1);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const getTextPreview = (value: any) => {
    try {
      if (!value || !Array.isArray(value)) return 'Empty content';
      
      const extractText = (node: any): string => {
        if (typeof node === 'string') return node;
        if (node.text) return node.text;
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractText).join('');
        }
        return '';
      };
      
      const text = value.map(extractText).join(' ').trim();
      return text.length > 100 ? text.substring(0, 100) + '...' : text || 'Empty content';
    } catch (error) {
      return 'Error reading content';
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-white border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Version History</h2>
        </div>
        <Button onClick={saveRevision} size="sm" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Revision
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <label htmlFor="revision-select" className="text-sm font-medium">
          Compare revision:
        </label>
        <select
          id="revision-select"
          value={selectedRevisionIndex}
          onChange={(e) => setSelectedRevisionIndex(Number(e.target.value))}
          className="px-3 py-1 border rounded text-sm"
        >
          {revisions.map((_, i) => (
            <option key={i} value={i}>
              Revision {i + 1}
            </option>
          ))}
        </select>
        <Button
          onClick={() => restoreRevision(selectedRevision)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <GitBranch className="h-4 w-4" />
          Restore This Version
        </Button>
      </div>

      {/* Revisions List */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Saved Revisions ({revisions.length})
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {revisions.map((revision, index) => (
            <div
              key={revision.id}
              className={cn(
                "flex items-start justify-between p-3 rounded border cursor-pointer transition-colors",
                selectedRevisionIndex === index
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white hover:bg-gray-50"
              )}
              onClick={() => setSelectedRevisionIndex(index)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{revision.label}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {formatTimestamp(revision.timestamp)}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {getTextPreview(revision.value)}
                </div>
              </div>
              <div className="flex gap-1 ml-3">
                {revisions.length > 1 && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRevision(index);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Revision Preview */}
      <div className="border rounded-lg">
        <div className="bg-gray-50 px-3 py-2 border-b text-sm font-medium flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          {selectedRevision?.label} ({formatTimestamp(selectedRevision?.timestamp || new Date())})
        </div>
        <div className="p-3">
          <div className="bg-gray-50 rounded border p-3 min-h-[100px]">
            <div className="text-sm text-gray-700">
              {getTextPreview(selectedRevision?.value)}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border">
        <strong>How to use:</strong> Save revisions as you work to create restore points. 
        Select any revision to preview it. Click "Restore This Version" to apply it to your editor.
      </div>
    </div>
  );
} 