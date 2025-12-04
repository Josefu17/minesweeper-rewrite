package minesweeper.domain

enum class BlockType {
    HIDDEN,     // User hasn't clicked it
    FLAGGED,    // User put a flag
    REVEALED,   // User clicked it (Safe). Shows number or empty.
    MINE,       // User clicked a mine
    REVEALED_MINE; // Passively revealed mine after the game is lost
}