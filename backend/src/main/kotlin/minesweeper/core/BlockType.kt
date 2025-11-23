package minesweeper.core

/**
 * Enum representing different states of blocks in a Minesweeper game.
 */
enum class BlockType(
    private val baseSymbol: Char?
) {
    UNKNOWN('-'),    // Default state for unexplored blocks.
    MINE('*'),       // Represents a block containing a mine.
    MARKED('?'),     // Indicates a flagged or marked block by the player.
    BLANK(' '),      // Represents an empty block with no adjacent mines.
    REVEALED(null); // Revealed; symbol depends on adjacent mines
//    IN_PROGRESS('X');// Block currently being investigated (legacy, mainly for CLI) // TODO remove if not needed at the end, yb

    /**
     * Convert this type to a character for text-based rendering.
     */
    fun toChar(adjacentMines: Int = 0): Char =
        when (this) {
            REVEALED -> '0' + adjacentMines       // same as (char)(i + 48)
            else -> baseSymbol!!
        }
}