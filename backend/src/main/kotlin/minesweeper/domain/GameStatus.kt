package minesweeper.domain

enum class GameStatus {
    READY, // New State: Board Generated, timer at 0
    RUNNING, // Timer ticking
    WON,
    LOST
}