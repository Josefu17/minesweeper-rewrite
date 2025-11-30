package minesweeper.api.request

import minesweeper.core.Difficulty

data class NewGameRequest(
    val difficulty: Difficulty,

    // Used only if difficulty == CUSTOM
    val rows: Int = 0,
    val columns: Int = 0,
    val customMines: Int? = null,
    val customLives: Int? = null
)