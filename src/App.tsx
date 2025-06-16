import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import AddCellControls from "./components/AddCellControls";
import PdfTable from "./components/PdfTable";
import PdfExportButton from "./components/PdfExportButton";
import FavoriteControls, {
  type FavoriteItem,
} from "./components/FavoriteControls"; // Import FavoriteControls and its type
import { type CellData } from "@/lib/constants";

// Define some sample favorite items
const sampleFavorites: FavoriteItem[] = [
  {
    id: "fav1",
    name: "3x - Hlavní vypínač",
    cellText: "Hlavní vypínač",
    cellSize: 3,
  },
  {
    id: "fav2",
    name: "4x - Přepěťová ochrana",
    cellText: "Přepěťová ochrana",
    cellSize: 4,
  },
  { id: "fav3", name: "1x - Rezerva", cellText: "Rezerva", cellSize: 1 },
  { id: "fav4", name: "1x - Jistič", cellText: "Jistič", cellSize: 2 },
  { id: "fav5", name: "1x - Rack", cellText: "Rack", cellSize: 1 },
];

function App() {
  const [cells, setCells] = useState<CellData[]>([]);
  const [favorites] = useState<FavoriteItem[]>(sampleFavorites); // Add state for favorites

  const addCell = (text: string, size: CellData["size"]) => {
    const newCell: CellData = {
      id: Date.now().toString(), // Simple unique ID
      text,
      size,
    };
    setCells((prevCells) => [...prevCells, newCell]);
  };

  const removeCell = (id: string) => {
    setCells((prevCells) => prevCells.filter((cell) => cell.id !== id));
  };

  // Handler for adding a cell from a favorite button
  const addCellFromFavorite = (text: string, size: CellData["size"]) => {
    addCell(text, size); // Reuse the existing addCell logic
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Tvorba štítků pro rozvaděče
          </CardTitle>
          <CardDescription className="text-center">
            Přidejte štítky, zvolte jejich velikost a exportujte je do PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FavoriteControls
            favorites={favorites}
            onAddFavorite={addCellFromFavorite}
          />
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
