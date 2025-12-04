package minesweeper.api

import minesweeper.api.request.CustomConfig
import minesweeper.api.request.NewGameRequest
import minesweeper.core.BlockType
import minesweeper.core.Difficulty
import minesweeper.core.GameStatus
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

class GameServiceTest {

    private val service = GameService()

    @Test
    fun `createGame initializes correct configuration for Difficulty Levels`() {
        // 1. Test EASY
        val easyGame = service.createGame(NewGameRequest(Difficulty.EASY))
        assertEquals(9, easyGame.rows)
        assertEquals(9, easyGame.columns)
        assertEquals(10, easyGame.mineCount)
        assertEquals(1, easyGame.livesLeft)

        // 2. Test HARD
        val hardGame = service.createGame(NewGameRequest(Difficulty.HARD))
        assertEquals(16, hardGame.rows)
        assertEquals(30, hardGame.columns)
        assertEquals(99, hardGame.mineCount)
        assertEquals(0, hardGame.livesLeft) // Hard has 0 lives (1 life total)
    }

    @Test
    fun `createGame handles valid Custom inputs`() {
        val request = NewGameRequest(
            difficulty = Difficulty.CUSTOM,
            customConfig = CustomConfig(
                rows = 20,
                columns = 20,
                customMines = 50,
                customLives = 2
            ),
        )

        val gameDto = service.createGame(request)

        assertEquals(20, gameDto.rows)
        assertEquals(20, gameDto.columns)
        assertEquals(50, gameDto.mineCount)
        assertEquals(2, gameDto.livesLeft)
    }

    @Test
    fun `createGame handles clamps too many mines`() {
        val request = NewGameRequest(
            difficulty = Difficulty.CUSTOM,
            customConfig = CustomConfig(
                rows = 10,
                columns = 10,
                customMines = 99,
                customLives = 1
            ),
        )

        val gameDto = service.createGame(request)

        assertEquals(10, gameDto.rows)
        assertEquals(10, gameDto.columns)
        assertEquals(91, gameDto.mineCount) // up to 9 fields should be spared as safe-zone
        assertEquals(1, gameDto.livesLeft)
    }

    @Test
    fun `getGameState returns valid DTO for existing game`() {
        // 1. Create
        val created = service.createGame(NewGameRequest(Difficulty.EASY))
        assertNotNull(created.id)

        // 2. Retrieve
        val retrieved = service.getGameState(created.id)

        // 3. Assert
        assertNotNull(retrieved)
        assertEquals(created.id, retrieved?.id)
        assertEquals(GameStatus.RUNNING, retrieved?.status)
        // Check grid mapping
        assertEquals(9, retrieved?.grid?.size)
        assertEquals(BlockType.HIDDEN, retrieved?.grid?.get(0)?.get(0)?.state)
    }

    @Test
    fun `actions return null for non-existent ID`() {
        val badId = "non-existent-uuid"

        assertNull(service.getGameState(badId))
        assertNull(service.reveal(badId, 0, 0))
        assertNull(service.toggleMark(badId, 0, 0))
        assertNull(service.autoExpand(badId, 0, 0))
    }

    @Test
    fun `reveal action updates game state`() {
        // 1. Create Game
        val game = service.createGame(NewGameRequest(Difficulty.EASY))

        // 2. Perform Action (Reveal 0,0)
        val updatedDto = service.reveal(game.id, 0, 0)

        assertNotNull(updatedDto)
        // Verify the cell at 0,0 changed state
        val cell = updatedDto!!.grid[0][0]
        assertEquals(BlockType.REVEALED, cell.state)
    }
}