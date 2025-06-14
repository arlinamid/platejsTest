import { diffWords, diffLines, Change } from 'diff';

export interface DiffResult {
  changes: Change[];
  hasChanges: boolean;
  addedCount: number;
  removedCount: number;
}

/**
 * Extract plain text from Plate.js editor value
 */
export function extractTextFromValue(value: any): string {
  if (!value || !Array.isArray(value)) return '';
  
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (node.text) return node.text;
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join('');
    }
    return '';
  };
  
  return value.map(extractText).join('\n').trim();
}

/**
 * Extract structured text with formatting info from Plate.js editor value
 */
export function extractStructuredText(value: any): string {
  if (!value || !Array.isArray(value)) return '';
  
  const extractWithStructure = (node: any, depth = 0): string => {
    const indent = '  '.repeat(depth);
    
    if (typeof node === 'string') return node;
    if (node.text) return node.text;
    
    if (node.type) {
      let content = '';
      if (node.children && Array.isArray(node.children)) {
        content = node.children.map((child: any) => extractWithStructure(child, depth + 1)).join('');
      }
      
      // Add structure markers for different node types
      switch (node.type) {
        case 'h1':
          return `${indent}# ${content}\n`;
        case 'h2':
          return `${indent}## ${content}\n`;
        case 'h3':
          return `${indent}### ${content}\n`;
        case 'blockquote':
          return `${indent}> ${content}\n`;
        case 'code_block':
          return `${indent}\`\`\`\n${content}\n${indent}\`\`\`\n`;
        case 'ul':
        case 'ol':
          return `${content}`;
        case 'li':
          return `${indent}- ${content}\n`;
        case 'p':
        default:
          return `${content}\n`;
      }
    }
    
    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any) => extractWithStructure(child, depth)).join('');
    }
    
    return '';
  };
  
  return value.map((node: any) => extractWithStructure(node)).join('').trim();
}

/**
 * Compare two editor values and return word-level differences
 */
export function compareEditorValues(oldValue: any, newValue: any): DiffResult {
  const oldText = extractTextFromValue(oldValue);
  const newText = extractTextFromValue(newValue);
  
  const changes = diffWords(oldText, newText);
  
  let addedCount = 0;
  let removedCount = 0;
  
  changes.forEach(change => {
    if (change.added) addedCount += change.count || 0;
    if (change.removed) removedCount += change.count || 0;
  });
  
  return {
    changes,
    hasChanges: changes.some(change => change.added || change.removed),
    addedCount,
    removedCount
  };
}

/**
 * Compare two editor values with structural information
 */
export function compareEditorStructure(oldValue: any, newValue: any): DiffResult {
  const oldText = extractStructuredText(oldValue);
  const newText = extractStructuredText(newValue);
  
  const changes = diffLines(oldText, newText);
  
  let addedCount = 0;
  let removedCount = 0;
  
  changes.forEach(change => {
    if (change.added) addedCount += change.count || 0;
    if (change.removed) removedCount += change.count || 0;
  });
  
  return {
    changes,
    hasChanges: changes.some(change => change.added || change.removed),
    addedCount,
    removedCount
  };
}

/**
 * Get a summary of changes between two revisions
 */
export function getChangeSummary(diffResult: DiffResult): string {
  if (!diffResult.hasChanges) {
    return 'No changes';
  }
  
  const parts: string[] = [];
  if (diffResult.addedCount > 0) {
    parts.push(`+${diffResult.addedCount} added`);
  }
  if (diffResult.removedCount > 0) {
    parts.push(`-${diffResult.removedCount} removed`);
  }
  
  return parts.join(', ');
} 