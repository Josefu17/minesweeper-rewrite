package minesweeper.core

/**
 * Represents a block in a Minesweeper game.
 */
class Block(
    x: Int,
    y: Int,
    type: BlockType
) {
    val coordinate: Coordinate = Coordinate(x, y)

    /**
     * Original type when the world was created (MINE or BLANK).
     * This never changes.
     */
    val originalType: BlockType = type

    /**
     * Current visible state of this block from the player's POV.
     */
    var blockType: BlockType = BlockType.UNKNOWN
        private set

    /**
     * Number of adjacent mines; only meaningful if blockType == DISCOVERED.
     */
    var adjacentMines: Int = 0
        private set

    /**
     * Modify only the visible state (no number, for non-DISCOVERED).
     */
    fun modify(blockType: BlockType) {
        this.blockType = blockType
        if (blockType != BlockType.DISCOVERED) {
            adjacentMines = 0
        }
    }

    /**
     * Modify the block to DISCOVERED with given adjacent mine count.
     */
    fun modifyDiscovered(adjacentMines: Int) {
        this.blockType = BlockType.DISCOVERED
        this.adjacentMines = adjacentMines
    }

    /**
     * Character representation (for debugging / CLI).
     * Frontend UI would usually ignore this and use blockType + adjacentMines.
     */
    fun displayChar(): Char = blockType.toChar(adjacentMines)
}
