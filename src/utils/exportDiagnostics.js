/* eslint-disable no-console */
/**
 * Export Panel Diagnostic Tests
 * Run these in browser console to diagnose export issues
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                           🏆 GOLDEN RULE 🏆                               ║
 * ║                                                                           ║
 * ║   ALWAYS use browser rendering for exports to guarantee the user         ║
 * ║   receives EXACTLY what they see when designing.                         ║
 * ║                                                                           ║
 * ║   We use html-to-image (SVG foreignObject) NOT html2canvas               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Usage: Open DevTools console, then run:
 *   - window.exportDiag.checkFrames()
 *   - window.exportDiag.testTextRendering()
 *   - window.exportDiag.runAllTests()
 */
/* global html2canvas */

const exportDiagnostics = {
  /**
   * Check if frame elements exist and have proper attributes
   */
  checkFrames: () => {
    console.group('🔍 Frame Element Check');

    const frames = document.querySelectorAll('[data-frame-id]');
    console.log(`Found ${frames.length} exportable frames`);

    frames.forEach((frame, i) => {
      const frameId = frame.getAttribute('data-frame-id');
      const carouselId = frame.getAttribute('data-carousel-id');
      const projectKey = frame.getAttribute('data-project-key');
      const dimensions = `${frame.offsetWidth}x${frame.offsetHeight}`;

      console.log(`  Frame ${i + 1}: ID=${frameId}, Carousel=${carouselId}, Key=${projectKey}, Size=${dimensions}`);

      // Check for text elements
      const textElements = frame.querySelectorAll('span[contenteditable], span');
      if (textElements.length > 0) {
        console.log(`    Text elements: ${textElements.length}`);
        textElements.forEach((el, j) => {
          if (el.textContent?.trim()) {
            const whiteSpace = getComputedStyle(el).whiteSpace;
            console.log(`      [${j}] "${el.textContent.substring(0, 30)}..." (whiteSpace: ${whiteSpace})`);
          }
        });
      }
    });

    console.groupEnd();
    return frames.length;
  },

  /**
   * Test text rendering issues
   */
  testTextRendering: () => {
    console.group('📝 Text Rendering Check');

    const frames = document.querySelectorAll('[data-frame-id]');
    const issues = [];

    frames.forEach((frame, i) => {
      const textElements = frame.querySelectorAll('span, p, h1, h2, h3, div');

      textElements.forEach((el) => {
        const style = getComputedStyle(el);
        const text = el.textContent?.trim();

        if (!text) return;

        // Check for problematic CSS that html2canvas may mishandle
        if (style.whiteSpace === 'pre-wrap') {
          issues.push({
            frame: i + 1,
            text: text.substring(0, 30),
            issue: 'whiteSpace: pre-wrap may cause spacing issues',
          });
        }

        if (style.letterSpacing && style.letterSpacing !== 'normal') {
          issues.push({
            frame: i + 1,
            text: text.substring(0, 30),
            issue: `letterSpacing: ${style.letterSpacing} may not render correctly`,
          });
        }

        if (el.hasAttribute('contenteditable')) {
          issues.push({
            frame: i + 1,
            text: text.substring(0, 30),
            issue: 'contentEditable attribute may affect html2canvas',
          });
        }
      });
    });

    if (issues.length === 0) {
      console.log('✅ No text rendering issues detected');
    } else {
      console.log(`⚠️ Found ${issues.length} potential issues:`);
      issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. Frame ${issue.frame}: "${issue.text}..." - ${issue.issue}`);
      });
    }

    console.groupEnd();
    return issues;
  },

  /**
   * Test font loading status
   */
  checkFonts: async () => {
    console.group('🔤 Font Loading Check');

    try {
      await document.fonts.ready;
      console.log('Font loading status: ready');
      console.log(`Loaded fonts: ${document.fonts.size}`);

      const loadedFonts = [];
      document.fonts.forEach((font) => {
        if (font.status === 'loaded') {
          loadedFonts.push(`${font.family} (${font.weight})`);
        }
      });

      console.log('Loaded font families:', loadedFonts.slice(0, 10));
      if (loadedFonts.length > 10) {
        console.log(`  ... and ${loadedFonts.length - 10} more`);
      }
    } catch (e) {
      console.error('Font loading check failed:', e);
    }

    console.groupEnd();
  },

  /**
   * Test single frame export (non-destructive preview)
   */
  previewExport: async (frameIndex = 0) => {
    console.group('🖼️ Export Preview Test');

    const frames = document.querySelectorAll('[data-frame-id]');
    if (frames.length === 0) {
      console.error('No frames found to export');
      console.groupEnd();
      return;
    }

    const frame = frames[frameIndex];
    if (!frame) {
      console.error(`Frame ${frameIndex} not found. Available: 0-${frames.length - 1}`);
      console.groupEnd();
      return;
    }

    console.log(`Testing export of frame ${frameIndex} (${frame.offsetWidth}x${frame.offsetHeight})`);

    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      console.log('html2canvas not in global scope (expected in bundled app)');
      console.log('Use the Export button to test actual export');
      console.groupEnd();
      return;
    }

    try {
      const canvas = await html2canvas(frame, {
        scale: 2,
        logging: true,
        onclone: () => {
          console.log('Cloned element for rendering');
        },
      });

      console.log(`Canvas created: ${canvas.width}x${canvas.height}`);
      console.log('Preview URL:', canvas.toDataURL('image/png').substring(0, 100) + '...');

      // Open preview in new tab
      const win = window.open();
      if (win) {
        win.document.write(
          `<img src="${canvas.toDataURL('image/png')}" style="max-width:100%;border:1px solid #ccc;" />`
        );
        win.document.write(
          '<p style="font-family:sans-serif;color:#666;">Compare this to the in-app preview for differences</p>'
        );
      }
    } catch (e) {
      console.error('Preview export failed:', e);
    }

    console.groupEnd();
  },

  /**
   * Run all diagnostic tests
   */
  runAllTests: async () => {
    console.log('═══════════════════════════════════════════');
    console.log('       EXPORT DIAGNOSTIC TEST SUITE        ');
    console.log('═══════════════════════════════════════════');

    exportDiagnostics.checkFrames();
    exportDiagnostics.testTextRendering();
    await exportDiagnostics.checkFonts();

    console.log('═══════════════════════════════════════════');
    console.log('  To test actual export, use the Export    ');
    console.log('  panel in the UI with DevTools open       ');
    console.log('═══════════════════════════════════════════');
  },
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.exportDiag = exportDiagnostics;
  console.log('📊 Export diagnostics loaded. Run window.exportDiag.runAllTests() to start.');
}

export default exportDiagnostics;
