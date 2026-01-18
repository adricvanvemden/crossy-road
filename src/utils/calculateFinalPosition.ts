export function calculateFinalPosition(currentPos: { rowIndex: number; tileIndex: number }, moves: ('up' | 'down' | 'left' | 'right')[]): { rowIndex: number; tileIndex: number } {
    return moves.reduce((pos, move) => {
        if (move === 'up') {
            return {
                rowIndex: pos.rowIndex + 1,
                tileIndex: pos.tileIndex
            }
        } else if (move === 'down') {
            return {
                rowIndex: pos.rowIndex - 1,
                tileIndex: pos.tileIndex
            }
        } else if (move === 'left') {
            return {
                rowIndex: pos.rowIndex,
                tileIndex: pos.tileIndex - 1
            }
        } else if (move === 'right') {
            return {
                rowIndex: pos.rowIndex,
                tileIndex: pos.tileIndex + 1
            }
        }
        return pos;
    }, currentPos);
}