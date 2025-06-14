# Ruler Plugin for Plate.js Editor

This document describes the ruler plugin implementation that adds ruler, page setup, and layout functionality to the Plate.js editor.

## Features

### 🔧 Core Components

1. **Ruler Component** (`src/components/plate-ui/ruler.tsx`)
   - Visual ruler with major and minor tick marks
   - Support for different units (px, in, cm)
   - Margin indicators
   - Configurable width and scale

2. **Layout Wrapper** (`src/components/plate-ui/layout-wrapper.tsx`)
   - Single-page layout with configurable dimensions
   - Ruler integration
   - Page setup dialog integration
   - Responsive design with proper margins

3. **Multi-Page Layout** (`src/components/plate-ui/multi-page-layout.tsx`)
   - Multi-page layout with automatic page breaks
   - Content flows across multiple pages
   - Dynamic page count calculation
   - Page numbering and content overflow handling

4. **Page Setup** (`src/components/plate-ui/page-setup.tsx`)
   - Paper size selection (Letter, A4, Legal, Custom)
   - Orientation control (Portrait/Landscape)
   - Margin configuration
   - Unit selection (px, in, cm)

### 🎛️ Toolbar Controls

1. **Ruler Toggle Button** - Show/hide the ruler
2. **Page Setup Button** - Open page configuration dialog
3. **Layout Toggle Button** - Switch between page and web layout modes
4. **Multi-Page Toggle Button** - Switch between single and multi-page modes (only visible in page layout)

### 🏗️ Plugin Architecture

1. **Layout Plugin** (`src/components/editor/plugins/layout-plugin.tsx`)
   - Integrates with Plate.js plugin system
   - Wraps editor content with layout functionality
   - Conditionally applies page layout based on mode

2. **Layout Store** (`src/lib/layout-store.ts`)
   - Zustand-based state management
   - Manages ruler visibility, page setup, and layout mode
   - Persists page configuration

3. **Toolbar Integration** (`src/components/plate-ui/layout-toolbar-buttons.tsx`)
   - Toolbar button components
   - Connected to layout store
   - Proper tooltip integration

## Installation & Setup

The plugin is already integrated into the editor. The following files were added/modified:

### New Files Created:
- `src/components/plate-ui/layout-toolbar-buttons.tsx`
- `src/components/plate-ui/multi-page-layout.tsx`
- `src/components/editor/plugins/layout-plugin.tsx`
- `src/lib/layout-store.ts`

### Modified Files:
- `src/components/editor/plugins/editor-plugins.tsx` - Added LayoutPlugin
- `src/components/plate-ui/fixed-toolbar-buttons.tsx` - Added toolbar buttons

## Usage

### Basic Usage

1. **Toggle Ruler**: Click the ruler button in the toolbar to show/hide the ruler
2. **Page Setup**: Click the settings button to configure page dimensions and margins
3. **Layout Mode**: Click the layout button to switch between page and web layout modes
4. **Multi-Page Mode**: Click the multi-page button to switch between single and multi-page layouts

### Page Layout Mode

When in page layout mode:
- Content is constrained to page dimensions
- Ruler shows page width with margin indicators
- Page setup controls are available
- Content is centered with proper margins

#### Single Page Mode
- Content is contained within one page
- Overflow content is scrollable within the page
- Best for shorter documents

#### Multi-Page Mode
- Content automatically flows across multiple pages
- Dynamic page count calculation based on content height
- Page numbers displayed on each page
- Best for longer documents that need proper page breaks

### Web Layout Mode

When in web layout mode:
- Content flows naturally without page constraints
- Ruler and page setup are hidden
- Standard web-based editing experience

## Configuration

### Default Page Configuration

```typescript
const defaultPageConfig: PageSetupConfig = {
  paperSize: 'letter',
  orientation: 'portrait',
  margins: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  },
  width: 8.5,
  height: 11,
  unit: 'in',
};
```

### Supported Paper Sizes

- **Letter**: 8.5" × 11"
- **A4**: 21cm × 29.7cm  
- **Legal**: 8.5" × 14"
- **Custom**: User-defined dimensions

### Supported Units

- **px**: Pixels
- **in**: Inches (96 DPI)
- **cm**: Centimeters (37.8 DPI)

## State Management

The plugin uses Zustand for state management with the following state:

```typescript
interface LayoutState {
  showRuler: boolean;           // Ruler visibility
  showPageSetup: boolean;       // Page setup dialog visibility
  layoutMode: 'page' | 'web';   // Current layout mode
  multiPageMode: boolean;       // Single vs multi-page mode
  pageConfig: PageSetupConfig;  // Page configuration
  // ... action methods
}
```

## Styling

The ruler and layout components use Tailwind CSS classes and are designed to integrate seamlessly with the existing Plate.js UI components.

### Key Style Features:
- Responsive design
- Proper contrast and accessibility
- Consistent with existing UI patterns
- Print-friendly page layout

## Dependencies

- **Zustand**: State management
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **@udecode/cn**: Class name utilities

## Future Enhancements

Potential improvements for the ruler plugin:

1. **Ruler Interactions**
   - Drag to adjust margins
   - Click to set tab stops
   - Indent guides

2. **Advanced Page Setup**
   - Headers and footers
   - Page numbering
   - Multiple page sizes in one document

3. **Print Integration**
   - Print preview
   - Page break indicators
   - Print-specific styling

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode

## Troubleshooting

### Common Issues

1. **Ruler not showing**: Check if `showRuler` is true in layout store
2. **Page layout not applying**: Ensure `layoutMode` is set to 'page'
3. **Margins not working**: Verify page configuration units and values

### Debug Tools

Use browser dev tools to inspect the layout store state:

```javascript
// In browser console
window.__ZUSTAND_DEVTOOLS__ // If devtools are enabled
```

## API Reference

### Layout Store Actions

- `toggleRuler()`: Toggle ruler visibility
- `togglePageSetup()`: Toggle page setup dialog
- `toggleLayoutMode()`: Switch between page/web modes
- `setPageConfig(config)`: Update page configuration

### Component Props

See individual component files for detailed prop interfaces and usage examples. 