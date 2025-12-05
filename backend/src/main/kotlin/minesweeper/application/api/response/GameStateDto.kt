package minesweeper.application.api.response

import minesweeper.domain.BlockType
import minesweeper.domain.Difficulty
import minesweeper.domain.GameStatus

data class GameStateDto(
    val id: String,
    val difficulty: Difficulty,
    val status: GameStatus,
    val livesLeft: Int,
    val rows: Int,
    val columns: Int,
    val mineCount: Int,
    val marksLeft: Int,
    val grid: List<List<CellDto>>
)

data class CellDto(
    val x: Int,
    val y: Int,
    val state: BlockType,
    val adjacentMines: Int? // only non-null if state == REVEALED
)