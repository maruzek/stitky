export const BASE_CELL_WIDTH_CM = 1.8;
export const BASE_CELL_HEIGHT_CM = 1.36;

export interface CellData {
  id: string;
  text: string;
  size: 1 | 2 | 3 | 4; // Represents 1x, 2x, 3x, or 4x width
}
