package minesweeper.api.dto

import minesweeper.core.Difficulty

data class NewGameRequest(
    val rows: Int,
    val columns: Int,
    val difficulty: Difficulty
)
