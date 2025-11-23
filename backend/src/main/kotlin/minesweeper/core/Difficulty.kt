package minesweeper.core


enum class Difficulty(
    val mineRatio: Double,
    val lives: Int
) {
    MEDIUM(0.25, 1),
    HARD(0.40, 0);
}