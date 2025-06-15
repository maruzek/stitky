import jsPDF from 'jspdf';
import { type CellData, BASE_CELL_WIDTH_CM, BASE_CELL_HEIGHT_CM } from '@/lib/constants';

// PDF constants
const CM_TO_POINTS = 28.3464567; // 1 cm = 28.346... points (PDF unit)
const PAGE_MARGIN_CM = 1;
const PAGE_MARGIN_POINTS = PAGE_MARGIN_CM * CM_TO_POINTS;

// Convert cm dimensions to points
const CELL_BASE_WIDTH_PT = BASE_CELL_WIDTH_CM * CM_TO_POINTS;
const CELL_HEIGHT_PT = BASE_CELL_HEIGHT_CM * CM_TO_POINTS;
const CELL_PADDING_PT = 4;

// --- Font Loading Variables & Functions ---
let fontDataPromise: Promise<string | null> | null = null;

const FONT_NAME_IN_PDF = "NotoSansCustom"; // The name to use with doc.setFont
const FONT_FILENAME_IN_VFS = "NotoSans-Regular.ttf"; // Filename in jsPDF's VFS
const FONT_PATH = '/fonts/NotoSans-Regular.ttf'; // Path in your public directory

function fetchAndProcessFont(): Promise<string | null> {
  // This function is called only if fontDataPromise is null
  return (async () => {
    try {
      const response = await fetch(FONT_PATH);
      if (!response.ok) {
        console.error(`Font file not found: ${FONT_PATH}. Status: ${response.status}`);
        throw new Error(`Font file not found: ${FONT_PATH}`);
      }
      const fontBlob = await response.blob();
      const reader = new FileReader();
      return await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (reader.result) {
            resolve((reader.result as string).split(',')[1]); // Get Base64 part
          } else {
            reject(new Error("FileReader did not produce a result."));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(fontBlob);
      });
    } catch (error) {
      console.error("Failed to fetch or process custom font data:", error);
      fontDataPromise = null; // Reset promise on failure to allow retry on next call
      return null;
    }
  })();
}

function getFontData(): Promise<string | null> {
  if (!fontDataPromise) {
    fontDataPromise = fetchAndProcessFont();
  }
  return fontDataPromise;
}

async function ensureCustomFontIsLoaded(doc: jsPDF): Promise<boolean> {
  const fontBase64Data = await getFontData();

  if (!fontBase64Data) {
    console.warn("Custom font data is not available. Cannot load custom font.");
    return false;
  }

  // 1. Add font file to jsPDF's VFS.
  // jsPDF.API.vfs is static/global. We attempt to add it for each instance.
  // If it's already there, jsPDF will throw an error which we can specifically catch.
  try {
    doc.addFileToVFS(FONT_FILENAME_IN_VFS, fontBase64Data);
  } catch (error) {
    if (error instanceof Error && error.message && error.message.toLowerCase().includes("file already exists in vfs")) {
      // This is expected if the font was added by a previous jsPDF instance.
      // The file is in the global VFS, so this is not a failure condition for this step.
    } else {
      // An unexpected error occurred while trying to add the font to VFS.
      console.error("Failed to add font to VFS:", error);
      return false; // Cannot proceed if VFS addition fails for other reasons.
    }
  }

  // 2. Register the font with the *current* jsPDF instance.
  // jsPDF's addFont method should internally check if this font (name/style combination)
  // has already been registered for this instance and avoid reprocessing if so.
  try {
    doc.addFont(FONT_FILENAME_IN_VFS, FONT_NAME_IN_PDF, 'normal');
    // Verification (optional, as addFont should handle idempotency):
    // const updatedFontList = doc.getFontList();
    // if (!updatedFontList || !updatedFontList[FONT_NAME_IN_PDF]) {
    //   console.warn(`Font ${FONT_NAME_IN_PDF} was expected to be in the instance's font list after addFont(), but was not found.`);
    // }
  } catch (error) {
    // This is where the "String contains an invalid character DOMException" was reported.
    // If addFont fails, the font won't be usable.
    console.error(`Failed to register font (${FONT_NAME_IN_PDF}) with the current jsPDF instance:`, error);
    return false;
  }

  return true;
}
// --- End Font Loading Variables & Functions ---

export const generatePdf = async (cells: CellData[]) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  // const usableWidth = pageWidth - 2 * PAGE_MARGIN_POINTS; // Not used, can be removed if not needed

  let currentX = PAGE_MARGIN_POINTS;
  let currentY = PAGE_MARGIN_POINTS;
  const maxFontSize = 10;
  const minFontSize = 6;

  // --- Load and set custom font ---
  const fontCanBeUsed = await ensureCustomFontIsLoaded(doc);

  if (fontCanBeUsed) {
    doc.setFont(FONT_NAME_IN_PDF, 'normal');
  } else {
    console.warn("Custom font setup failed. Falling back to default font. Diacritics may not render correctly.");
    // Optionally, set a known standard font like 'Helvetica' as a fallback
    // doc.setFont('Helvetica', 'normal');
  }
  // --- End Font Handling ---

  cells.forEach((cell) => {
    const cellWidthPt = CELL_BASE_WIDTH_PT * cell.size;

    if (currentX + cellWidthPt > pageWidth - PAGE_MARGIN_POINTS) {
      currentX = PAGE_MARGIN_POINTS;
      currentY += CELL_HEIGHT_PT;

      if (currentY + CELL_HEIGHT_PT > pageHeight - PAGE_MARGIN_POINTS) {
        doc.addPage();
        currentY = PAGE_MARGIN_POINTS;
        // Re-set font on new page, as page-specific settings might reset
        if (fontCanBeUsed) {
          doc.setFont(FONT_NAME_IN_PDF, 'normal');
        } else {
          // doc.setFont('Helvetica', 'normal'); // Fallback
        }
      }
    }

    doc.setDrawColor(0);
    doc.rect(currentX, currentY, cellWidthPt, CELL_HEIGHT_PT);
    doc.setTextColor(0, 0, 0);

    let fontSize = maxFontSize;
    doc.setFontSize(fontSize); // Set font size before measuring

    let textLines = doc.splitTextToSize(cell.text, cellWidthPt - (CELL_PADDING_PT * 2));
    let textMetrics = doc.getTextDimensions(textLines, { fontSize: fontSize }); // Pass fontSize for accurate metrics

    while ((textMetrics.h > CELL_HEIGHT_PT - (CELL_PADDING_PT * 2) || textMetrics.w > cellWidthPt - (CELL_PADDING_PT * 2)) && fontSize > minFontSize) {
      fontSize -= 0.5;
      doc.setFontSize(fontSize); // Update font size
      textLines = doc.splitTextToSize(cell.text, cellWidthPt - (CELL_PADDING_PT * 2));
      textMetrics = doc.getTextDimensions(textLines, { fontSize: fontSize }); // Re-measure with new font size
    }

    const textX = currentX + cellWidthPt / 2;
    
    // Calculate Y position for the top of the text block to be centered vertically within the padded cell area
    const paddedCellHeight = CELL_HEIGHT_PT - (CELL_PADDING_PT * 2);
    const textBlockHeight = textMetrics.h;
    // textYForTopBaseline is the Y coordinate for the top of the text block
    const textYForTopBaseline = (currentY + CELL_PADDING_PT) + (paddedCellHeight - textBlockHeight) / 2;

    doc.text(textLines, textX, textYForTopBaseline, {
      align: 'center',
      baseline: 'top', // Use 'top' baseline for precise positioning
      maxWidth: cellWidthPt - (CELL_PADDING_PT * 2),
    });

    currentX += cellWidthPt;
  });

  doc.save('export_tabulky.pdf');
};
