// ── PDF & DOCX Download Utilities ─────────────────────────────────────────

/**
 * Downloads the given HTML element as a PDF file.
 * Uses jsPDF + html2canvas for conversion.
 * PHASE 2 UPGRADE: Replace with server-side PDF generation for better quality.
 */
export async function downloadAsPDF(elementId: string, filename: string): Promise<void> {
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found`);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
}

/**
 * Downloads the given HTML content as a basic DOCX-like file.
 * PHASE 2 UPGRADE: Replace with docx.js for proper DOCX generation.
 */
export function downloadAsDocx(html: string, filename: string): void {
  // Basic HTML-to-Word compatible format
  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <title>${filename}</title>
  <style>
    body { font-family: Calibri, sans-serif; font-size: 11pt; margin: 2cm; color: #1e293b; }
    h1 { font-size: 20pt; color: #0f172a; }
    h2 { font-size: 14pt; color: #1e293b; margin-top: 16pt; }
    p { margin-bottom: 8pt; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e2e8f0; padding: 8pt; }
    ${/* Strip gradient backgrounds for Word compat */''}
    [style*="linear-gradient"] { background: #6366f1 !important; color: white !important; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([docxContent], {
    type: 'application/vnd.ms-word;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the plain text content of the template to the clipboard.
 */
export async function copyToClipboard(html: string): Promise<void> {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  await navigator.clipboard.writeText(text);
}
