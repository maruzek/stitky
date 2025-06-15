import type { CellData } from '@/lib/constants'; // Import from constants
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Icon for remove button

interface TableCellProps {
    cell: CellData;
    baseDisplayWidthPx: number;
    baseDisplayHeightPx: number;
    onRemove: () => void;
}

const TableCell: React.FC<TableCellProps> = ({ cell, baseDisplayWidthPx, baseDisplayHeightPx, onRemove }) => {
    const cellWidth = baseDisplayWidthPx * cell.size;
    const cellHeight = baseDisplayHeightPx;

    return (
        <div
            className="border border-gray-400 bg-white p-2 flex flex-col justify-center items-center relative group"
            style={{
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
                overflow: 'hidden',
                wordBreak: 'break-word',
            }}
            title={`Velikost: ${cell.size}x`}
        >
            <span className="text-xs text-center">
                {cell.text}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                onClick={onRemove}
                aria-label="Odebrat buňku"
            >
                <X size={14} />
            </Button>
        </div>
    );
};

export default TableCell;
