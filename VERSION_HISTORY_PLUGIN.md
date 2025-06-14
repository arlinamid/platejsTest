# Version History Plugin for Plate.js

This plugin adds version history functionality to your Plate.js editor, allowing users to save, browse, and restore different versions of their content.

## Features

- **Save Revisions**: Manually save snapshots of the current editor content
- **Browse History**: View all saved revisions with timestamps and content previews
- **Quick Restore**: Dropdown menu for fast access to recent revisions
- **Restore Versions**: Click to restore any previous version
- **Delete Revisions**: Remove unwanted revisions (except the last one)
- **Content Preview**: See a text preview of each revision
- **Show Diffs**: Compare any revision with the current version or other revisions
- **Visual Diff View**: Highlighted additions, deletions, and changes
- **Diff Modal**: Full-screen diff comparison with toggle for unchanged content
- **Integrated UI**: Seamlessly integrated into the Plate.js toolbar

## Components

### 1. VersionHistoryPlugin
The main plugin that registers the version history functionality with Plate.js.

**Location**: `src/components/editor/plugins/version-history-plugin.tsx`

### 2. VersionHistoryToolbarButton
A toolbar button component that provides the version history interface.

**Location**: `src/components/plate-ui/version-history-toolbar-button.tsx`

**Features**:
- Save revision button with save icon
- History button that opens a popover with full version history
- Quick restore dropdown for fast access
- Detailed revision list with previews
- Selected revision preview with restore option

### 3. VersionHistoryToolbar (Optional)
A standalone floating toolbar component (currently not used but available).

**Location**: `src/components/plate-ui/version-history-toolbar.tsx`

### 4. DiffView
A component that displays visual differences between two revisions.

**Location**: `src/components/plate-ui/diff-view.tsx`

**Features**:
- Word-level and line-level diff highlighting
- Color-coded additions (green) and deletions (red)
- Toggle to show/hide unchanged content
- Diff statistics (added/removed count)
- Clean, readable diff presentation

### 5. DiffModal
A modal dialog for displaying diff comparisons in full-screen.

**Location**: `src/components/plate-ui/diff-modal.tsx`

### 6. Diff Utilities
Utility functions for comparing editor content and extracting text.

**Location**: `src/lib/diff-utils.ts`

**Functions**:
- `compareEditorValues()`: Compare two editor values
- `extractTextFromValue()`: Extract plain text from editor content
- `extractStructuredText()`: Extract text with formatting structure
- `getChangeSummary()`: Get a summary of changes

## Installation

The plugin is already integrated into the editor. It's included in:

1. **Plugin Registration**: Added to `src/components/editor/plugins/editor-plugins.tsx`
2. **Toolbar Integration**: Added to `src/components/plate-ui/fixed-toolbar-buttons.tsx`

## Usage

### For Users

1. **Save a Revision**: Click the save icon (💾) in the toolbar to save the current content as a new revision
2. **View History**: Click the history icon (🕒) to open the version history panel
3. **Quick Restore**: Use the "Quick Restore" dropdown for fast access to recent versions
4. **Browse & Restore**: 
   - Click on any revision in the list to preview it
   - Click the restore button (🔀) to apply that version to the editor
5. **Compare Revisions**: 
   - Click the compare button (⚖️) next to any revision to see differences with current version
   - Use "Compare with Current" button in the preview section
6. **Delete Revisions**: Click the delete button (🗑️) to remove unwanted revisions

### For Developers

#### Customizing the Plugin

You can customize the plugin behavior by modifying the components:

```tsx
// Customize revision labeling
const newRevision: Revision = {
  id: Date.now().toString(),
  value: cloneDeep(currentValue),
  timestamp: new Date(),
  label: `Custom Label ${revisions.length + 1}`, // Customize this
};
```

#### Adding Auto-Save

You can extend the plugin to automatically save revisions:

```tsx
// Add to VersionHistoryToolbarButton component
React.useEffect(() => {
  const interval = setInterval(() => {
    if (currentValue && currentValue.length > 0) {
      saveRevision();
    }
  }, 300000); // Auto-save every 5 minutes

  return () => clearInterval(interval);
}, [currentValue]);
```

#### Persisting Revisions

To persist revisions across sessions, you can integrate with localStorage or a backend:

```tsx
// Save to localStorage
const saveToStorage = (revisions: Revision[]) => {
  localStorage.setItem('editor-revisions', JSON.stringify(revisions));
};

// Load from localStorage
const loadFromStorage = (): Revision[] => {
  const stored = localStorage.getItem('editor-revisions');
  return stored ? JSON.parse(stored) : defaultRevisions;
};
```

## API Reference

### Revision Interface

```tsx
interface Revision {
  id: string;           // Unique identifier
  value: any;          // Editor content (Plate.js value)
  timestamp: Date;     // When the revision was created
  label?: string;      // Display label for the revision
}
```

### Key Functions

- `saveRevision()`: Saves the current editor content as a new revision
- `restoreRevision(revision)`: Restores a specific revision to the editor
- `deleteRevision(index)`: Removes a revision from the history
- `showDiffWithCurrent(revision)`: Shows diff between a revision and current content
- `showDiffBetweenRevisions(oldRevision, newRevision)`: Shows diff between two revisions
- `getTextPreview(value)`: Extracts text preview from editor content
- `formatTimestamp(date)`: Formats timestamp for display

## Styling

The plugin uses Tailwind CSS classes and follows the existing Plate.js UI patterns. Key styling elements:

- **Toolbar Integration**: Matches existing toolbar button styles
- **Popover Layout**: Uses consistent spacing and typography
- **Color Coding**: Blue for selected items, red for delete actions
- **Responsive Design**: Adapts to different screen sizes

## Dependencies

- `@udecode/plate/react`: Core Plate.js functionality
- `@udecode/cn`: Utility functions and styling
- `lodash`: For deep cloning of editor content
- `lucide-react`: Icons for the UI
- `diff`: Text comparison library for diff functionality
- Existing Plate.js UI components (Button, Popover, DropdownMenu, Dialog, etc.)

## Future Enhancements

Potential improvements for the plugin:

1. ✅ **Diff View**: Show visual differences between revisions (COMPLETED)
2. **Side-by-side Diff**: Split view comparison mode
3. **Branching**: Support for creating branches from specific revisions
4. **Collaboration**: Multi-user revision tracking
5. **Export**: Export revision history and diffs
6. **Search**: Search through revision content
7. **Auto-save**: Configurable automatic revision saving
8. **Compression**: Optimize storage for large revision histories
9. **Metadata**: Add more metadata like author, tags, etc.
10. **Diff Statistics**: More detailed change analytics
11. **Merge Conflicts**: Handle and resolve conflicts between revisions 