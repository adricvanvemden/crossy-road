import { MAX_TILE_INDEX, MIN_TILE_INDEX } from "../constants";
import { calculateFinalPosition } from "./calculateFinalPosition";
import { Map, RowType } from "../components/Map.ts";

export function endsUpInValidPosition(currentPosition: { rowIndex: number; tileIndex: number }, moves: ('up' | 'down' | 'left' | 'right')[]): boolean {
  // Calculate where the player would end up after the move
  const finalPosition = calculateFinalPosition(currentPosition, moves);

  // Detect if we hit the edge of the board
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === MIN_TILE_INDEX - 1 ||
    finalPosition.tileIndex === MAX_TILE_INDEX + 1
  ) {
    // Invalid move, ignore move command
    return false;
  }

  // Detect if we hit a tree
  const finalRow = Map.metaData[finalPosition.rowIndex - 1];
  if (
    finalRow &&
    finalRow.type === RowType.Foliage &&
    finalRow.trees?.some((tree) => tree.tile_index === finalPosition.tileIndex)
  ) {
    // Invalid move, ignore move command
    return false;
  }

  return true;
}