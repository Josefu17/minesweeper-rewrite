package minesweeper.api.request

import jakarta.validation.Valid
import jakarta.validation.constraints.AssertTrue
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import minesweeper.core.Difficulty

data class NewGameRequest(
    val difficulty: Difficulty,

    @Valid
    val customConfig: CustomConfig? = null
) {
    @AssertTrue(message = "Rows, Columns, and Mines are required for CUSTOM difficulty")
    fun customConfigValidation(): Boolean {
        return difficulty != Difficulty.CUSTOM || customConfig != null
    }
}

data class CustomConfig(
    @field:Min(5) @field:Max(30)
    val rows: Int,

    @field:Min(5) @field:Max(30)
    val columns: Int,

    @field:Min(1)
    val customMines: Int,

    @field:Min(0) @field:Max(3)
    val customLives: Int
)