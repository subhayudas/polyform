
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FileSelectorProps {
  material: string;
  quantity: number;
  onMaterialChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
}

const materials = [
  'PLA',
  'ABS',
  'PETG',
  'TPU',
  'ASA',
  'PVA',
  'HIPS',
  'Wood Fill',
  'Metal Fill',
  'Carbon Fiber'
];

const FileSelector: React.FC<FileSelectorProps> = ({
  material,
  quantity,
  onMaterialChange,
  onQuantityChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="material">Material *</Label>
        <Select value={material} onValueChange={onMaterialChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select material for pricing" />
          </SelectTrigger>
          <SelectContent>
            {materials.map((mat) => (
              <SelectItem key={mat} value={mat}>
                {mat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
        />
      </div>
    </div>
  );
};

export default FileSelector;
