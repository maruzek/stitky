import React from 'react';
import { Button } from '@/components/ui/button';
import { type CellData } from '@/lib/constants';

export interface FavoriteItem {
    id: string; // Unique ID for the favorite button key
    name: string; // Text to display on the button
    cellText: string; // Text to be inserted into the cell
    cellSize: CellData['size'];
}

interface FavoriteControlsProps {
    favorites: FavoriteItem[];
    onAddFavorite: (text: string, size: CellData['size']) => void;
}

const FavoriteControls: React.FC<FavoriteControlsProps> = ({ favorites, onAddFavorite }) => {
    if (!favorites.length) {
        return null;
    }

    return (
        <div className="mb-4 p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-center\">Rychlé Přidání</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {favorites.map((fav) => (
                    <Button
                        key={fav.id}
                        variant="outline"
                        onClick={() => onAddFavorite(fav.cellText, fav.cellSize)}
                        className="w-full h-auto py-2 px-3 text-xs sm:text-sm whitespace-normal text-center leading-tight"
                        title={`Přidat: ${fav.cellText} (velikost ${fav.cellSize}x)`}
                    >
                        {fav.name}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default FavoriteControls;
