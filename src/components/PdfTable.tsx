import { type CellData, BASE_CELL_WIDTH_CM, BASE_CELL_HEIGHT_CM } from '@/lib/constants'; // Import from constants
import TableCell from './TableCell';

interface PdfTableProps {
    cells: CellData[];
    onRemoveCell: (id: string) => void;
}

// Approximate base dimensions for screen display (adjust as needed)
// These are just for visual representation on the screen
const DISPLAY_BASE_WIDTH_PX = 70; // Approx 1.8cm at 96 DPI
const DISPLAY_BASE_HEIGHT_PX = 53; // Approx 1.36cm at 96 DPI

const PdfTable: React.FC<PdfTableProps> = ({ cells, onRemoveCell }) => {
    if (cells.length === 0) {
        return <p className="text-gray-500">Zatím nebyly přidány žádné štítky. Přidejte štítky, abyste je zde viděli.</p>;
    }

    return (
        <div className="border p-2 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Náhled aktuálních Štítků</h2>
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1">
                {cells.map((cell) => (
                    <TableCell
                        key={cell.id}
                        cell={cell}
                        baseDisplayWidthPx={DISPLAY_BASE_WIDTH_PX}
                        baseDisplayHeightPx={DISPLAY_BASE_HEIGHT_PX}
                        onRemove={() => onRemoveCell(cell.id)}
                    />
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Poznámka: Rozměry jsou přibližné pro zobrazení na obrazovce. PDF použije přesné cm.
                Základní buňka: {BASE_CELL_WIDTH_CM}cm x {BASE_CELL_HEIGHT_CM}cm.
            </p>
        </div>
    );
};

export default PdfTable;
