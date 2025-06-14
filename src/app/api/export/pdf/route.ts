import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { html, filename } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Create temporary directory for processing
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique filename for temporary HTML file
    const uniqueId = uuidv4();
    const htmlFile = path.join(tempDir, `${uniqueId}.html`);

    let browser;
    try {
      // Write HTML to temporary file
      await fs.writeFile(htmlFile, html, 'utf-8');

      // Launch Puppeteer browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 800 });
      
      // Load the HTML file
      await page.goto(`file://${htmlFile}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Generate PDF with text-based output
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in'
        },
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 10px; color: #666; text-align: center; width: 100%; margin: 0 auto;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `,
      });

      // Clean up
      await browser.close();
      await fs.unlink(htmlFile).catch(() => {});

      // Return PDF as response
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || 'document.pdf'}"`,
        },
      });
    } catch (error) {
      // Clean up in case of error
      if (browser) {
        await browser.close().catch(() => {});
      }
      await fs.unlink(htmlFile).catch(() => {});
      throw error;
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF using Puppeteer. Please try again.' },
      { status: 500 }
    );
  }
} 