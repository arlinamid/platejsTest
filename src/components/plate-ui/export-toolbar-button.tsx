'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { withProps } from '@udecode/cn';
import {
  BaseParagraphPlugin,
  createSlateEditor,
  serializeHtml,
  SlateLeaf,
} from '@udecode/plate';
import { BaseAlignPlugin } from '@udecode/plate-alignment';
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote';
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { BaseCommentsPlugin } from '@udecode/plate-comments';
import { BaseDatePlugin } from '@udecode/plate-date';
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from '@udecode/plate-font';
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from '@udecode/plate-heading';
import { BaseHighlightPlugin } from '@udecode/plate-highlight';
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { BaseIndentPlugin } from '@udecode/plate-indent';
import { BaseIndentListPlugin } from '@udecode/plate-indent-list';
import { BaseKbdPlugin } from '@udecode/plate-kbd';
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout';
import { BaseLineHeightPlugin } from '@udecode/plate-line-height';
import { BaseLinkPlugin } from '@udecode/plate-link';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from '@udecode/plate-math';
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from '@udecode/plate-media';
import { BaseMentionPlugin } from '@udecode/plate-mention';
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table';
import { BaseTogglePlugin } from '@udecode/plate-toggle';
import { useEditorRef } from '@udecode/plate/react';
import { ArrowDownToLineIcon } from 'lucide-react';
import Prism from 'prismjs';

import { BlockquoteElementStatic } from '@/components/plate-ui/blockquote-element-static';
import { CodeBlockElementStatic } from '@/components/plate-ui/code-block-element-static';
import { CodeLeafStatic } from '@/components/plate-ui/code-leaf-static';
import { CodeLineElementStatic } from '@/components/plate-ui/code-line-element-static';
import { CodeSyntaxLeafStatic } from '@/components/plate-ui/code-syntax-leaf-static';
import { ColumnElementStatic } from '@/components/plate-ui/column-element-static';
import { ColumnGroupElementStatic } from '@/components/plate-ui/column-group-element-static';
import { CommentLeafStatic } from '@/components/plate-ui/comment-leaf-static';
import { DateElementStatic } from '@/components/plate-ui/date-element-static';
import { HeadingElementStatic } from '@/components/plate-ui/heading-element-static';
import { HighlightLeafStatic } from '@/components/plate-ui/highlight-leaf-static';
import { HrElementStatic } from '@/components/plate-ui/hr-element-static';
import { ImageElementStatic } from '@/components/plate-ui/image-element-static';
import {
  FireLiComponent,
  FireMarker,
} from '@/components/plate-ui/indent-fire-marker';
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from '@/components/plate-ui/indent-todo-marker-static';
import { KbdLeafStatic } from '@/components/plate-ui/kbd-leaf-static';
import { LinkElementStatic } from '@/components/plate-ui/link-element-static';
import { MediaAudioElementStatic } from '@/components/plate-ui/media-audio-element-static';
import { MediaFileElementStatic } from '@/components/plate-ui/media-file-element-static';
import { MediaVideoElementStatic } from '@/components/plate-ui/media-video-element-static';
import { MentionElementStatic } from '@/components/plate-ui/mention-element-static';
import { ParagraphElementStatic } from '@/components/plate-ui/paragraph-element-static';
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@/components/plate-ui/table-cell-element-static';
import { TableElementStatic } from '@/components/plate-ui/table-element-static';
import { TableRowElementStatic } from '@/components/plate-ui/table-row-element-static';
import { TocElementStatic } from '@/components/plate-ui/toc-element-static';
import { ToggleElementStatic } from '@/components/plate-ui/toggle-element-static';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { EditorStatic } from './editor-static';
import { EquationElementStatic } from './equation-element-static';
import { InlineEquationElementStatic } from './inline-equation-element-static';
import { ToolbarButton } from './toolbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Input } from './input';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PageBreakPlugin, PAGE_BREAK_KEY } from '@/components/editor/plugins/page-break-plugin';
import { PageBreakElement } from './page-break-element';

const siteUrl = 'https://platejs.org';

export function ExportToolbarButton({ children, ...props }: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();
  const [showFileNameDialog, setShowFileNameDialog] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [exportType, setExportType] = React.useState<'pdf' | 'docx' | 'epub' | 'html' | 'image' | 'markdown'>('pdf');
  const [isExporting, setIsExporting] = React.useState(false);

  const getCanvas = async () => {
    const { default: html2canvas } = await import('html2canvas');

    const style = document.createElement('style');
    document.head.append(style);
    style.sheet?.insertRule(
      'body > div:last-child img { display: inline-block !important; }'
    );

    const canvas = await html2canvas(editor.api.toDOMNode(editor)!);
    style.remove();

    return canvas;
  };

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const promptForFileName = (type: 'pdf' | 'docx' | 'epub' | 'html' | 'image' | 'markdown') => {
    const defaultNames = {
      pdf: 'document.pdf',
      docx: 'document.docx',
      epub: 'document.epub',
      html: 'document.html',
      image: 'document.png',
      markdown: 'document.md'
    };
    
    setExportType(type);
    setFileName(defaultNames[type]);
    setShowFileNameDialog(true);
  };

  const handleExport = async () => {
    if (!fileName.trim()) return;
    
    setIsExporting(true);
    setShowFileNameDialog(false);
    
    try {
      switch (exportType) {
        case 'pdf':
          await exportToPdfPrint();
          break;
        case 'docx':
          await exportToDocx();
          break;
        case 'epub':
          await exportToEpub();
          break;
        case 'html':
          await exportToHtml();
          break;
        case 'image':
          await exportToImage();
          break;
        case 'markdown':
          await exportToMarkdown();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPdfPrint = async () => {
    // Generate print-optimized HTML content
    const htmlContent = await generatePrintOptimizedHtml();
    
    try {
      // Create a temporary window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please allow popups for this site.');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      await new Promise(resolve => {
        printWindow.onload = resolve;
        setTimeout(resolve, 1000); // Fallback timeout
      });

      // Focus and print
      printWindow.focus();
      printWindow.print();
      
      // Close the window after a delay to allow printing to complete
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    } catch (error) {
      console.error('Print PDF export failed:', error);
      alert(`Print PDF export failed: ${error.message}\n\nFalling back to image-based PDF generation.`);
      // Fallback to client-side PDF generation (image-based)
      await exportToPdfFallback();
    }
  };

  const exportToPdfFallback = async () => {
    const canvas = await getCanvas();

    const PDFLib = await import('pdf-lib');
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const imageEmbed = await pdfDoc.embedPng(canvas.toDataURL('PNG'));
    const { height, width } = imageEmbed.scale(1);
    page.drawImage(imageEmbed, {
      height,
      width,
      x: 0,
      y: 0,
    });
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

    await downloadFile(pdfBase64, fileName);
  };

  const exportToDocx = async () => {
    try {
      // Try to use docx library for DOCX generation
      try {
        const docx = await import('docx');
        const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
        
        // Convert editor content to DOCX format
        const docxContent = await convertEditorToDocx(docx);
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: docxContent,
          }],
        });

        const blob = await Packer.toBlob(doc);
        downloadBlob(blob, fileName);
      } catch (docxError) {
        console.warn('DOCX library not available, falling back to HTML export');
        // Fallback to HTML export with .docx extension
        const html = await generateHtmlForExport();
        const blob = new Blob([html], { type: 'text/html' });
        downloadBlob(blob, fileName);
      }
    } catch (error) {
      console.error('DOCX export failed:', error);
      alert('DOCX export failed. Please install the "docx" package for full DOCX support, or the file will be exported as HTML.');
    }
  };

  const convertEditorToDocx = async (docx: any) => {
    const { Paragraph, TextRun, HeadingLevel } = docx;
    const paragraphs: any[] = [];

    const processNode = (node: any): any[] => {
      const result: any[] = [];

      if (node.type === 'p') {
        const runs: any[] = [];
        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.text) {
              runs.push(new TextRun({
                text: child.text,
                bold: child.bold,
                italics: child.italic,
                underline: child.underline ? {} : undefined,
              }));
            }
          });
        }
        result.push(new Paragraph({ children: runs }));
      } else if (node.type?.startsWith('h')) {
        const level = parseInt(node.type.charAt(1));
        const text = node.children?.map((child: any) => child.text).join('') || '';
        result.push(new Paragraph({
          text,
          heading: level === 1 ? HeadingLevel.HEADING_1 :
                  level === 2 ? HeadingLevel.HEADING_2 :
                  level === 3 ? HeadingLevel.HEADING_3 :
                  level === 4 ? HeadingLevel.HEADING_4 :
                  level === 5 ? HeadingLevel.HEADING_5 :
                  HeadingLevel.HEADING_6,
        }));
      } else if (node.children) {
        node.children.forEach((child: any) => {
          result.push(...processNode(child));
        });
      }

      return result;
    };

    editor.children.forEach((node: any) => {
      paragraphs.push(...processNode(node));
    });

    return paragraphs;
  };

  const generateHtmlForExport = async () => {
    const components = {
      [BaseAudioPlugin.key]: MediaAudioElementStatic,
      [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
      [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
      [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
      [BaseCodeLinePlugin.key]: CodeLineElementStatic,
      [BaseCodePlugin.key]: CodeLeafStatic,
      [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
      [BaseColumnItemPlugin.key]: ColumnElementStatic,
      [BaseColumnPlugin.key]: ColumnGroupElementStatic,
      [BaseCommentsPlugin.key]: CommentLeafStatic,
      [BaseDatePlugin.key]: DateElementStatic,
      [BaseEquationPlugin.key]: EquationElementStatic,
      [BaseFilePlugin.key]: MediaFileElementStatic,
      [BaseHighlightPlugin.key]: HighlightLeafStatic,
      [BaseHorizontalRulePlugin.key]: HrElementStatic,
      [BaseImagePlugin.key]: ImageElementStatic,
      [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
      [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
      [BaseKbdPlugin.key]: KbdLeafStatic,
      [BaseLinkPlugin.key]: LinkElementStatic,
      [BaseMentionPlugin.key]: MentionElementStatic,
      [BaseParagraphPlugin.key]: ParagraphElementStatic,
      [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
      [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
      [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
      [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
      [BaseTableCellPlugin.key]: TableCellElementStatic,
      [BaseTablePlugin.key]: TableElementStatic,
      [BaseTableRowPlugin.key]: TableRowElementStatic,
      [BaseTocPlugin.key]: TocElementStatic,
      [BaseTogglePlugin.key]: ToggleElementStatic,
      [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
      [BaseVideoPlugin.key]: MediaVideoElementStatic,
      [PAGE_BREAK_KEY]: ({ children }: any) => (
        <div style={{ pageBreakBefore: 'always', height: '0', overflow: 'hidden' }}>
          {children}
        </div>
      ),
      [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
      [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
      [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
      [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
      [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
      [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
    };

    const editorStatic = createSlateEditor({
      plugins: [
        BaseColumnPlugin,
        BaseColumnItemPlugin,
        BaseTocPlugin,
        BaseVideoPlugin,
        BaseAudioPlugin,
        BaseParagraphPlugin,
        BaseHeadingPlugin,
        BaseMediaEmbedPlugin,
        BaseBoldPlugin,
        BaseCodePlugin,
        BaseItalicPlugin,
        BaseStrikethroughPlugin,
        BaseSubscriptPlugin,
        BaseSuperscriptPlugin,
        BaseUnderlinePlugin,
        BaseBlockquotePlugin,
        BaseDatePlugin,
        BaseEquationPlugin,
        BaseInlineEquationPlugin,
        BaseCodeBlockPlugin.configure({
          options: {
            prism: Prism,
          },
        }),
        BaseIndentPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              BaseBlockquotePlugin.key,
              BaseCodeBlockPlugin.key,
            ],
          },
        }),
        BaseIndentListPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              ...HEADING_LEVELS,
              BaseBlockquotePlugin.key,
              BaseCodeBlockPlugin.key,
              BaseTogglePlugin.key,
            ],
          },
          options: {
            listStyleTypes: {
              fire: {
                liComponent: FireLiComponent,
                markerComponent: FireMarker,
                type: 'fire',
              },
              todo: {
                liComponent: TodoLiStatic,
                markerComponent: TodoMarkerStatic,
                type: 'todo',
              },
            },
          },
        }),
        BaseLinkPlugin,
        BaseTableRowPlugin,
        BaseTablePlugin,
        BaseTableCellPlugin,
        BaseHorizontalRulePlugin,
        BaseFontColorPlugin,
        BaseFontBackgroundColorPlugin,
        BaseFontSizePlugin,
        BaseKbdPlugin,
        BaseAlignPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              BaseMediaEmbedPlugin.key,
              ...HEADING_LEVELS,
              BaseImagePlugin.key,
            ],
          },
        }),
        BaseLineHeightPlugin,
        BaseHighlightPlugin,
        BaseFilePlugin,
        BaseImagePlugin,
        BaseMentionPlugin,
        BaseCommentsPlugin,
        BaseTogglePlugin,
        PageBreakPlugin,
      ],
      value: editor.children,
    });

    const editorHtml = await serializeHtml(editorStatic, {
      components,
      editorComponent: EditorStatic,
      props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
    });

    const prismCss = `<link rel="stylesheet" href="${siteUrl}/prism.css">`;
    const tailwindCss = `<link rel="stylesheet" href="${siteUrl}/tailwind.css">`;
    const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`;

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
        ${tailwindCss}
        ${prismCss}
        ${katexCss}
        <style>
          :root {
            --font-sans: 'Inter', 'Inter Fallback';
            --font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback';
          }
          
          /* Print-optimized page settings */
          @page {
            margin: 1in;
            size: A4;
          }
          
          /* Ensure text is selectable and searchable in PDF */
          body {
            font-family: var(--font-sans);
            line-height: 1.6;
            color: #333;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Optimize text rendering for PDF */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Ensure proper text flow */
          p, div, span {
            text-rendering: optimizeLegibility;
          }
          
          /* Handle page breaks properly */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid-page;
          }
          
          /* Page break elements */
          [data-slate-type="page_break"] {
            page-break-before: always;
            height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
          }
          
          /* Avoid breaking inside elements */
          blockquote, pre, table {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Ensure images are handled properly */
          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Code blocks */
          pre, code {
            font-family: var(--font-mono);
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          /* Links should be visible in print */
          a {
            color: #0066cc;
            text-decoration: underline;
          }
          
          /* Table styling for PDF */
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${editorHtml}
      </body>
    </html>`;
  };

  const generatePrintOptimizedHtml = async () => {
    const components = {
      [BaseAudioPlugin.key]: MediaAudioElementStatic,
      [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
      [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
      [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
      [BaseCodeLinePlugin.key]: CodeLineElementStatic,
      [BaseCodePlugin.key]: CodeLeafStatic,
      [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
      [BaseColumnItemPlugin.key]: ColumnElementStatic,
      [BaseColumnPlugin.key]: ColumnGroupElementStatic,
      [BaseCommentsPlugin.key]: CommentLeafStatic,
      [BaseDatePlugin.key]: DateElementStatic,
      [BaseEquationPlugin.key]: EquationElementStatic,
      [BaseFilePlugin.key]: MediaFileElementStatic,
      [BaseHighlightPlugin.key]: HighlightLeafStatic,
      [BaseHorizontalRulePlugin.key]: HrElementStatic,
      [BaseImagePlugin.key]: ImageElementStatic,
      [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
      [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
      [BaseKbdPlugin.key]: KbdLeafStatic,
      [BaseLinkPlugin.key]: LinkElementStatic,
      [BaseMentionPlugin.key]: MentionElementStatic,
      [BaseParagraphPlugin.key]: ParagraphElementStatic,
      [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
      [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
      [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
      [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
      [BaseTableCellPlugin.key]: TableCellElementStatic,
      [BaseTablePlugin.key]: TableElementStatic,
      [BaseTableRowPlugin.key]: TableRowElementStatic,
      [BaseTocPlugin.key]: TocElementStatic,
      [BaseTogglePlugin.key]: ToggleElementStatic,
      [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
      [BaseVideoPlugin.key]: MediaVideoElementStatic,
      [PAGE_BREAK_KEY]: ({ children }: any) => (
        <div style={{ pageBreakBefore: 'always', height: '0', overflow: 'hidden' }}>
          {children}
        </div>
      ),
      [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
      [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
      [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
      [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
      [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
      [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
    };

    const editorStatic = createSlateEditor({
      plugins: [
        BaseColumnPlugin,
        BaseColumnItemPlugin,
        BaseTocPlugin,
        BaseVideoPlugin,
        BaseAudioPlugin,
        BaseParagraphPlugin,
        BaseHeadingPlugin,
        BaseMediaEmbedPlugin,
        BaseBoldPlugin,
        BaseCodePlugin,
        BaseItalicPlugin,
        BaseStrikethroughPlugin,
        BaseSubscriptPlugin,
        BaseSuperscriptPlugin,
        BaseUnderlinePlugin,
        BaseBlockquotePlugin,
        BaseDatePlugin,
        BaseEquationPlugin,
        BaseInlineEquationPlugin,
        BaseCodeBlockPlugin.configure({
          options: {
            prism: Prism,
          },
        }),
        BaseIndentPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              BaseBlockquotePlugin.key,
              BaseCodeBlockPlugin.key,
            ],
          },
        }),
        BaseIndentListPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              ...HEADING_LEVELS,
              BaseBlockquotePlugin.key,
              BaseCodeBlockPlugin.key,
              BaseTogglePlugin.key,
            ],
          },
          options: {
            listStyleTypes: {
              fire: {
                liComponent: FireLiComponent,
                markerComponent: FireMarker,
                type: 'fire',
              },
              todo: {
                liComponent: TodoLiStatic,
                markerComponent: TodoMarkerStatic,
                type: 'todo',
              },
            },
          },
        }),
        BaseLinkPlugin,
        BaseTableRowPlugin,
        BaseTablePlugin,
        BaseTableCellPlugin,
        BaseHorizontalRulePlugin,
        BaseFontColorPlugin,
        BaseFontBackgroundColorPlugin,
        BaseFontSizePlugin,
        BaseKbdPlugin,
        BaseAlignPlugin.extend({
          inject: {
            targetPlugins: [
              BaseParagraphPlugin.key,
              BaseMediaEmbedPlugin.key,
              ...HEADING_LEVELS,
              BaseImagePlugin.key,
            ],
          },
        }),
        BaseLineHeightPlugin,
        BaseHighlightPlugin,
        BaseFilePlugin,
        BaseImagePlugin,
        BaseMentionPlugin,
        BaseCommentsPlugin,
        BaseTogglePlugin,
        PageBreakPlugin,
      ],
      value: editor.children,
    });

    const editorHtml = await serializeHtml(editorStatic, {
      components,
      editorComponent: EditorStatic,
      props: { style: { padding: '0', margin: '0' } },
    });

    const prismCss = `<link rel="stylesheet" href="${siteUrl}/prism.css">`;
    const tailwindCss = `<link rel="stylesheet" href="${siteUrl}/tailwind.css">`;
    const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`;

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${fileName.replace('.pdf', '')}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
        ${tailwindCss}
        ${prismCss}
        ${katexCss}
        <style>
          @page {
            size: A4;
            margin: 2.5cm 2cm;
            @top-center {
              content: "${fileName.replace('.pdf', '')}";
              font-family: 'Times New Roman', serif;
              font-size: 10pt;
              color: #666;
            }
            @bottom-center {
              content: counter(page);
              font-family: 'Times New Roman', serif;
              font-size: 10pt;
              color: #666;
            }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            margin: 0;
            padding: 0;
            background: white;
            text-align: justify;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .content {
            text-indent: 1.5em;
          }
          
          .content p {
            margin: 0 0 1em 0;
            text-indent: 1.5em;
            orphans: 2;
            widows: 2;
          }
          
          .content p:first-child {
            text-indent: 0;
          }
          
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            orphans: 3;
            widows: 3;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          
          /* Page break elements */
          [data-slate-type="page_break"] {
            page-break-before: always;
            height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
          }
          
          h1 { font-size: 18pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
          h4 { font-size: 13pt; }
          h5 { font-size: 12pt; }
          h6 { font-size: 11pt; }
          
          p {
            page-break-inside: avoid;
            orphans: 2;
            widows: 2;
          }
          
          blockquote {
            margin: 1em 2em;
            padding: 0.5em 1em;
            border-left: 4px solid #ccc;
            font-style: italic;
            page-break-inside: avoid;
          }
          
          pre, code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10pt;
          }
          
          pre {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            page-break-inside: avoid;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            page-break-inside: avoid;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
          }
          
          a {
            color: #0066cc;
            text-decoration: underline;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${editorHtml}
        </div>
      </body>
    </html>`;
  };

  const exportToImage = async () => {
    const canvas = await getCanvas();
    await downloadFile(canvas.toDataURL('image/png'), fileName);
  };

  const exportToHtml = async () => {
    const html = await generateHtmlForExport();
    const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    await downloadFile(url, fileName);
  };

  const exportToMarkdown = async () => {
    const md = editor.getApi(MarkdownPlugin).markdown.serialize();
    const url = `data:text/markdown;charset=utf-8,${encodeURIComponent(md)}`;
    await downloadFile(url, fileName);
  };

  const exportToEpub = async () => {
    try {
      const zip = new JSZip();
      const title = fileName.replace('.epub', '');
      const content = await generateHtmlForExport();

      // EPUB structure
      zip.file('mimetype', 'application/epub+zip');
      
      // META-INF
      const metaInf = zip.folder('META-INF');
      metaInf?.file('container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      // OEBPS
      const oebps = zip.folder('OEBPS');
      
      // content.opf
      oebps?.file('content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator>Document Author</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`);

      // toc.ncx
      oebps?.file('toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
    <navPoint id="content" playOrder="1">
      <navLabel><text>${title}</text></navLabel>
      <content src="content.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`);

      // Content file
      const cleanContent = content
        .replace(/<link[^>]*>/g, '') // Remove external CSS links
        .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '') // Remove style blocks
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''); // Remove scripts

      oebps?.file('content.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${title}</title>
  <style>
    body { font-family: serif; line-height: 1.6; margin: 2em; }
    h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 1.5em; }
    p { margin-bottom: 1em; text-align: justify; }
    blockquote { margin: 1em 2em; font-style: italic; border-left: 4px solid #ccc; padding-left: 1em; }
    pre, code { font-family: monospace; background: #f5f5f5; padding: 0.5em; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: bold; }
  </style>
</head>
<body>
  ${cleanContent.replace(/.*<body[^>]*>/, '').replace(/<\/body>.*/, '')}
</body>
</html>`);

      const epubBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(epubBlob, fileName);
    } catch (error) {
      console.error('EPUB export failed:', error);
      alert('EPUB export failed. Please try again.');
    }
  };

  return (
    <>
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Export" isDropdown>
          <ArrowDownToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => promptForFileName('html')}>
            Export as HTML
          </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => promptForFileName('pdf')}>
              Export as PDF (Print)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => promptForFileName('docx')}>
              Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => promptForFileName('epub')}>
              Export as EPUB
          </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => promptForFileName('image')}>
            Export as Image
          </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => promptForFileName('markdown')}>
            Export as Markdown
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

      <Dialog open={showFileNameDialog} onOpenChange={setShowFileNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="filename" className="text-sm font-medium">
                File name:
              </label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name..."
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isExporting) {
                    handleExport();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFileNameDialog(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!fileName.trim() || isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
