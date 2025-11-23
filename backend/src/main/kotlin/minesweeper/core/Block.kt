package minesweeper.core

class Block(
    x: Int,
    y: Int
) {
    val coordinate = Coordinate(x, y)

    // --- THE TRUTH (Immutable after game start) ---
    var hasMine: Boolean = false
        internal set // Only World can set this during setup

    // --- THE VIEW (Mutable) ---
    var state: BlockType = BlockType.HIDDEN
        internal set

    // --- DATA ---
    var adjacentMines: Int = 0
        internal set
}