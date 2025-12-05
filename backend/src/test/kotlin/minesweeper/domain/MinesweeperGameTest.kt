package minesweeper.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class MinesweeperGameTest {

    @Test
    fun `First move generates safe zone (No mines around click)`() {
        // Setup: 4x4 Grid, 6 Mines (High density to ensure they appear elsewhere)
        val game = MinesweeperGame(rows = 4, columns = 4, mineCount = 6, lives = 0)

        // Act: Reveal (1, 1).
        // This triggers plantMines(safeZone = 1,1).
        game.reveal(Coordinate(1, 1))

        // Debug
        println("--- First Move World ---")
        game.world.printDebug()

        // Assert
        assertEquals(GameStatus.RUNNING, game.status)
        assertEquals(BlockType.REVEALED, game.world.getState(Coordinate(1, 1)))

        // Ensure the 3x3 area around (1,1) is MINE-FREE
        for (r in 0..2) {
            for (c in 0..2) {
                val neighbor = Coordinate(r, c)
                // Note: We use hasMine directly to check the "Truth", not the view
                assertEquals(false, game.world.hasMine(neighbor), "Neighbor $neighbor should be safe")
            }
        }
    }

    @Test
    fun `Game Won when all safe blocks revealed`() {
        val game = MinesweeperGame(rows = 4, columns = 4, mineCount = 1, lives = 0)

        // Arrange
        // Manually Setup Board (Bypass random generation)
        // Place just 1 mine at (3,3)
        val mineLoc = Coordinate(3, 3)
        game.world.debugSetMines(listOf(mineLoc))
        game.debugSetFirstMove(false) // Stop game from planting random mines

        // Act: Reveal everything EXCEPT the mine
        for (r in 0 until 4) {
            for (c in 0 until 4) {
                val coord = Coordinate(r, c)
                if (coord != mineLoc) {
                    game.reveal(coord)
                }
            }
        }

        println("--- Won Game World ---")
        game.world.printDebug()

        // Assert
        assertEquals(GameStatus.WON, game.status)
        assertEquals(BlockType.FLAGGED, game.world.getState(mineLoc), "Mine should be auto-flagged")
    }

    @Test
    fun `Game Lost when hitting mine with 0 lives`() {
        // Setup: 4x4 grid
        val game = MinesweeperGame(rows = 4, columns = 4, mineCount = 1, lives = 0)

        // 1. Setup specific scenario
        val mineLoc = Coordinate(0, 1)
        game.world.debugSetMines(listOf(mineLoc))
        game.debugSetFirstMove(false)

        // 2. Hit the known mine
        game.reveal(mineLoc)

        println("--- Lost Game World ---")
        game.world.printDebug()

        assertEquals(GameStatus.LOST, game.status)
        assertEquals(BlockType.MINE, game.world.getState(mineLoc))
    }

    @Test
    fun `Extra Life consumes life but keeps game running`() {
        // Setup: 4x4, 1 Mine, 1 Life
        val game = MinesweeperGame(rows = 4, columns = 4, mineCount = 1, lives = 1)

        // 1. Setup specific scenario
        val mineLoc = Coordinate(2, 2)
        game.world.debugSetMines(listOf(mineLoc))
        game.debugSetFirstMove(false)
        game.debugSetStatus(GameStatus.RUNNING)

        // 2. Hit the mine
        game.reveal(mineLoc)

        println("--- Extra Life World ---")
        game.world.printDebug()

        // Assert
        assertEquals(GameStatus.RUNNING, game.status)
        assertEquals(0, game.livesLeft)
        assertEquals(BlockType.MINE, game.world.getState(mineLoc))
    }

    @Test
    fun `toggleMark respects mine count limit`() {
        // Arrange
        // Setup: 2x2, 2 Mines. (So we only have 2 flags available)
        val game = MinesweeperGame(rows = 2, columns = 2, mineCount = 2, lives = 0)
        game.debugSetFirstMove(false) // Skip first move logic
        game.debugSetStatus(GameStatus.RUNNING)

        // Mark first mine
        game.toggleMark(Coordinate(0, 0))
        assertEquals(BlockType.FLAGGED, game.world.getState(Coordinate(0, 0)))
        assertEquals(1, game.world.marksLeft)

        // Mark second mine
        game.toggleMark(Coordinate(0, 1))
        assertEquals(BlockType.FLAGGED, game.world.getState(Coordinate(0, 1)))
        assertEquals(0, game.world.marksLeft)

        // Act
        // Try to mark a 3rd spot (should fail because marksLeft is 0)
        game.toggleMark(Coordinate(1, 0))
        assertEquals(BlockType.HIDDEN, game.world.getState(Coordinate(1, 0)), "Should not allow flagging when marks ran out")
        assertEquals(0, game.world.marksLeft)

        // 4. Unmark one
        game.toggleMark(Coordinate(0, 0))
        assertEquals(BlockType.HIDDEN, game.world.getState(Coordinate(0, 0)))
        assertEquals(1, game.world.marksLeft)
    }

    @Test
    fun `Actions ignored after Game Lost`() {
        // Setup: 4x4, 1 Mine
        val game = MinesweeperGame(rows = 4, columns = 4, mineCount = 1, lives = 0)
        val mineLoc = Coordinate(0, 0)
        val safeLoc = Coordinate(1, 1)

        game.world.debugSetMines(listOf(mineLoc))
        game.debugSetFirstMove(false)

        // 1. Lose the game
        game.reveal(mineLoc)
        assertEquals(GameStatus.LOST, game.status)

        // 2. Try to reveal a safe spot
        game.reveal(safeLoc)

        // Assert: State should still be HIDDEN, game still LOST
        assertEquals(BlockType.HIDDEN, game.world.getState(safeLoc), "Should not reveal after game over")
        assertEquals(GameStatus.LOST, game.status)
    }
}