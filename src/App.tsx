import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from 'react';
import AddCellControls from './components/AddCellControls';
import PdfTable from './components/PdfTable';
import PdfExportButton from './components/PdfExportButton';
import { type CellData } from '@/lib/constants'; // Removed unused imports

function App() {
  const [cells, setCells] = useState<CellData[]>([]);

  const addCell = (text: string, size: CellData['size']) => {
    const newCell: CellData = {
      id: Date.now().toString(), // Simple unique ID
      text,
      size,
    };
    setCells((prevCells) => [...prevCells, newCell]);
  };

  const removeCell = (id: string) => {
    setCells((prevCells) => prevCells.filter(cell => cell.id !== id));
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Tvorba štítků pro rozvaděče</CardTitle>
          <CardDescription className="text-center">
            Přidejte štítky, zvolte jejich velikost a exportujte je do PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddCellControls onAddCell={addCell} />
          <PdfTable cells={cells} onRemoveCell={removeCell} />
        </CardContent>
        {cells.length > 0 && (
          <CardFooter className="flex justify-center">
            <PdfExportButton cells={cells} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default App;
