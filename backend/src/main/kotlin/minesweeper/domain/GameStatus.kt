package minesweeper.domain

enum class GameStatus {
    READY, // Board Generated, timer at 0
    RUNNING, // Timer ticking
    WON,
    LOST
}