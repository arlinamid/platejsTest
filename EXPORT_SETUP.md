# Export Setup Guide

This guide explains how to set up the enhanced export functionality for the Plate.js editor.

## Features

The export toolbar button now supports:
- **PDF Export (Print-Optimized)** - High-quality text-based PDF generation using browser's native print dialog
- **DOCX Export** - Microsoft Word document format with professional formatting
- **EPUB Export** - Standard eBook format for e-readers
- **HTML Export** - Standalone HTML files
- **Image Export** - PNG images (raster format)
- **Markdown Export** - Plain markdown files
- **File Name Prompts** - Custom file naming for all exports

## Installation Requirements

### 1. DOCX Export
The DOCX export functionality requires the `docx` package, which is already installed.

### 2. EPUB Export
The EPUB export functionality requires `jszip` and `file-saver` packages, which are already installed.

### 3. Print-Optimized PDF Export

The PDF export now uses the browser's native print functionality, providing the best quality and compatibility.

**Advantages of Print-Optimized PDF:**
- ✅ **No Server Dependencies**: Uses browser's native PDF generation
- ✅ **No External Libraries**: No Puppeteer, WeasyPrint, or other dependencies needed
- ✅ **Text-based PDFs**: Generates PDFs with selectable, searchable text
- ✅ **Cross-platform**: Works in any modern browser
- ✅ **User Control**: User can adjust print settings (paper size, margins, etc.)
- ✅ **Professional Formatting**: Print-optimized CSS with proper page breaks, headers, and footers
- ✅ **High Quality**: Uses browser's optimized PDF rendering engine

**How it works:**
1. Generates print-optimized HTML with professional CSS styling
2. Opens content in a new browser window
3. Triggers the browser's native print dialog
4. User can save as PDF with their preferred settings

### 4. Fallback PDF Export
If the print dialog approach fails, the system will automatically fall back to client-side PDF generation using PDF-lib.

## Usage

1. Click the **Export** button in the toolbar
2. Select your desired export format:
   - **Export as PDF (Print)** - High-quality PDF using browser print dialog
   - **Export as DOCX** - Microsoft Word document with professional formatting
   - **Export as EPUB** - eBook format for e-readers
   - **Export as HTML** - Standalone HTML file
   - **Export as Image** - PNG image (raster format)
   - **Export as Markdown** - Plain markdown file
3. Enter your desired filename in the dialog
4. Click **Export** to download the file

## Technical Details

### Print-Optimized PDF Export
The PDF export generates HTML with specialized CSS for print:
- **Page Settings**: A4 format with proper margins
- **Typography**: Times New Roman font with optimal line spacing
- **Page Breaks**: Intelligent page break handling for headings and content
- **Headers/Footers**: Document title and page numbering
- **Print Optimization**: Orphans/widows control, proper text flow
- **Professional Styling**: Justified text, proper indentation, optimized for reading

**Key Benefits:**
- Text is selectable and searchable
- No server-side processing required
- User controls final PDF settings
- Consistent high-quality output
- Fast generation with no external dependencies

### DOCX Export
The DOCX export:
- Uses the `docx` library for professional document generation
- Preserves text formatting (bold, italic, underline, strikethrough)
- Maintains heading hierarchy (H1-H6) with proper styling
- Includes proper page margins and font settings (Times New Roman)
- Supports paragraph indentation and spacing
- Handles page breaks appropriately

### EPUB Export
The EPUB export:
- Creates a valid EPUB 2.0 format eBook
- Includes proper metadata and table of contents
- Generates clean XHTML content
- Preserves text formatting and structure
- Compatible with most e-readers and reading apps

### File Naming
All exports now prompt for a custom filename with appropriate default extensions:
- PDF: `document.pdf`
- DOCX: `document.docx`
- EPUB: `document.epub`
- HTML: `document.html`
- Image: `document.png`
- Markdown: `document.md`

## Troubleshooting

### Print PDF Issues
- **"Unable to open print window"**: Browser may be blocking popups - allow popups for this site
- **Print dialog doesn't appear**: Try refreshing the page and ensure popups are enabled
- **Content not loading**: Wait for the content to fully load before printing

### DOCX Export Issues
- **"DOCX export failed"**: Check browser console for specific errors
- **Missing formatting**: Complex formatting may not be fully preserved in DOCX
- **Large documents**: Very large documents may take longer to process

### EPUB Export Issues
- **"EPUB export failed"**: Ensure JSZip library is properly loaded
- **Invalid EPUB**: Some e-readers may be more strict about EPUB format validation

### General Issues
- **Large files**: Very large documents may take longer to export
- **Memory issues**: Complex documents with many images may require more memory
- **Browser compatibility**: Ensure you're using a modern browser with full ES6+ support

## Development Notes

The export functionality is implemented in:
- `src/components/plate-ui/export-toolbar-button.tsx` - Main export component with all export methods

To extend the export functionality:
1. Add new export types to the `exportType` union type
2. Implement the export function
3. Add the new option to the dropdown menu
4. Update the file name defaults
5. Install any required dependencies 