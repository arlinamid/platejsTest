'use client';

import React from 'react';
import { useEditorRef } from '@udecode/plate/react';
import { FileText } from 'lucide-react';

import { ToolbarButton } from '@/components/plate-ui/toolbar';
import { PAGE_BREAK_KEY } from '@/components/editor/plugins/page-break-plugin';

export function PageBreakToolbarButton() {
  const editor = useEditorRef();

  const insertPageBreak = () => {
    editor.tf.insertNodes({
      type: PAGE_BREAK_KEY,
      children: [{ text: '' }],
    });
  };

  return (
    <ToolbarButton
      onClick={insertPageBreak}
      tooltip="Insert Page Break"
    >
      <FileText className="h-4 w-4" />
    </ToolbarButton>
  );
} 