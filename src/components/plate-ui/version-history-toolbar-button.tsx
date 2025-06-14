'use client';

import * as React from 'react';
import { cloneDeep } from 'lodash';
import { Save, History, GitBranch, Clock, Trash2, ChevronDown, GitCompare } from 'lucide-react';

import { cn } from '@udecode/cn';
import { useEditorRef, useEditorValue } from '@udecode/plate/react';
import { Button } from '@/components/plate-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/plate-ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/plate-ui/popover';
import { ToolbarButton } from '@/components/plate-ui/toolbar';
import { DiffModal } from '@/components/plate-ui/diff-modal';
import { compareEditorValues, DiffResult } from '@/lib/diff-utils';

interface Revision {
  id: string;
  value: any;
  timestamp: Date;
  label?: string;
}

export function VersionHistoryToolbarButton() {
  const editor = useEditorRef();
  const currentValue = useEditorValue();
  
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
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = React.useState(false);
  const [currentDiff, setCurrentDiff] = React.useState<{
    diffResult: DiffResult;
    oldLabel: string;
    newLabel: string;
  } | null>(null);

  const selectedRevision = React.useMemo(
    () => revisions[selectedRevisionIndex],
    [revisions, selectedRevisionIndex]
  );

  const saveRevision = () => {
    const newRevision: Revision = {
      id: Date.now().toString(),
      value: cloneDeep(currentValue),
      timestamp: new Date(),
      label: `Revision ${revisions.length + 1}`,
    };
    setRevisions([...revisions, newRevision]);
  };

  const restoreRevision = (revision: Revision) => {
    editor.tf.setValue(cloneDeep(revision.value));
    setIsHistoryOpen(false);
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

  const showDiffWithCurrent = (revision: Revision) => {
    const diffResult = compareEditorValues(revision.value, currentValue);
    setCurrentDiff({
      diffResult,
      oldLabel: revision.label || `Revision ${revisions.findIndex(r => r.id === revision.id) + 1}`,
      newLabel: 'Current Version'
    });
    setIsDiffModalOpen(true);
    setIsHistoryOpen(false);
  };

  const showDiffBetweenRevisions = (oldRevision: Revision, newRevision: Revision) => {
    const diffResult = compareEditorValues(oldRevision.value, newRevision.value);
    const oldIndex = revisions.findIndex(r => r.id === oldRevision.id);
    const newIndex = revisions.findIndex(r => r.id === newRevision.id);
    
    setCurrentDiff({
      diffResult,
      oldLabel: oldRevision.label || `Revision ${oldIndex + 1}`,
      newLabel: newRevision.label || `Revision ${newIndex + 1}`
    });
    setIsDiffModalOpen(true);
    setIsHistoryOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Save Revision Button */}
      <ToolbarButton
        onClick={saveRevision}
        tooltip="Save Revision"
      >
        <Save className="h-4 w-4" />
      </ToolbarButton>

      {/* Version History Popover */}
      <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <PopoverTrigger asChild>
          <ToolbarButton
            pressed={isHistoryOpen}
            tooltip="Version History"
            isDropdown
          >
            <History className="h-4 w-4" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Version History</h3>
            </div>

            {/* Quick Restore Dropdown */}
            <div className="flex items-center gap-2 mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Quick Restore
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {revisions.map((revision, index) => (
                    <DropdownMenuItem
                      key={revision.id}
                      onClick={() => restoreRevision(revision)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{revision.label}</span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(revision.timestamp)}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Revisions List */}
            <div className="border rounded-lg bg-gray-50">
              <div className="p-3 border-b bg-white">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Saved Revisions ({revisions.length})
                </h4>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto p-2">
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
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          showDiffWithCurrent(revision);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700"
                        title="Compare with current"
                      >
                        <GitCompare className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreRevision(revision);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                        title="Restore this version"
                      >
                        <GitBranch className="h-3 w-3" />
                      </Button>
                      {revisions.length > 1 && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRevision(index);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                          title="Delete this revision"
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
            {selectedRevision && (
              <div className="mt-4 border rounded-lg">
                <div className="bg-gray-50 px-3 py-2 border-b text-sm font-medium flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  {selectedRevision.label} ({formatTimestamp(selectedRevision.timestamp)})
                </div>
                <div className="p-3">
                  <div className="bg-gray-50 rounded border p-3 min-h-[60px] max-h-32 overflow-y-auto">
                    <div className="text-sm text-gray-700">
                      {getTextPreview(selectedRevision.value)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      onClick={() => showDiffWithCurrent(selectedRevision)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-xs h-7 px-2"
                    >
                      <GitCompare className="h-3 w-3" />
                      Compare
                    </Button>
                    <Button
                      onClick={() => restoreRevision(selectedRevision)}
                      size="sm"
                      className="flex items-center gap-1 text-xs h-7 px-2"
                    >
                      <GitBranch className="h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Instructions */}
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border mt-4">
              <strong>How to use:</strong> Save revisions as you work to create restore points. 
              Use Quick Restore for fast access or browse the list to preview and restore any version.
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Diff Modal */}
      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        diffResult={currentDiff?.diffResult || null}
        oldLabel={currentDiff?.oldLabel || ''}
        newLabel={currentDiff?.newLabel || ''}
      />
    </div>
  );
} 