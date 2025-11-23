package minesweeper.api.dto

import minesweeper.core.Difficulty

data class NewGameRequest(
    val rows: Int,
    val columns: Int,
    val difficulty: Difficulty, // If CUSTOM, look at custom attributes

    // ignored for non-custom
    val customMines: Int? = null,
    val customLives: Int? = null
)
