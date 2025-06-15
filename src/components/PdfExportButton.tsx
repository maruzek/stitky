import type { CellData } from '@/lib/constants'; // Import from constants
import { Button } from '@/components/ui/button';
import { generatePdf } from '@/lib/pdfService'; // We'll create this

interface PdfExportButtonProps {
    cells: CellData[];
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ cells }) => {
    const handleExport = () => {
        generatePdf(cells);
    };

    return (
        <Button onClick={handleExport} variant="default" className="mt-4">
            Exportovat do PDF
        </Button>
    );
};

export default PdfExportButton;
