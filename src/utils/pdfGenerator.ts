import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads an A4 PDF from a container element holding .a4-page elements
 */
export async function downloadPdfFromElement(
  containerEl: HTMLElement,
  filename: string,
  onProgress?: (step: string) => void
): Promise<void> {
  const pageElements = containerEl.querySelectorAll<HTMLElement>('.a4-page');
  if (!pageElements || pageElements.length === 0) {
    throw new Error('No printable pages found.');
  }

  onProgress?.('Preparing document...');

  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const totalPages = pageElements.length;

  for (let i = 0; i < totalPages; i++) {
    const pageEl = pageElements[i];
    onProgress?.(`Processing page ${i + 1} of ${totalPages}...`);

    const canvas = await html2canvas(pageEl, {
      scale: 2, // 2x for sharp text & numbers
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // A4 dimensions
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  onProgress?.('Saving PDF...');
  pdf.save(filename);
}

/**
 * Triggers the browser native print window cleanly
 */
export function triggerPrint(): void {
  window.print();
}
