import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type CellData } from '@/lib/constants';

interface AddCellControlsProps {
    onAddCell: (text: string, size: CellData['size']) => void;
}

const AddCellControls: React.FC<AddCellControlsProps> = ({ onAddCell }) => {
    const [text, setText] = useState('');
    const [size, setSize] = useState<CellData['size']>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() === '') return;
        onAddCell(text, size);
        setText('');
        setSize(1);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg shadow space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cellText">Text štítku:</Label>
                <Input
                    id="cellText"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Zadejte text buňky"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cellSize">Velikost modulu:</Label>
                <Select
                    value={String(size)} // Select component expects string value
                    onValueChange={(value) => setSize(Number(value) as CellData['size'])}
                >
                    <SelectTrigger id="cellSize">
                        <SelectValue placeholder="Vyberte velikost" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" variant="default">
                Přidat Buňku
            </Button>
        </form>
    );
};

export default AddCellControls;
