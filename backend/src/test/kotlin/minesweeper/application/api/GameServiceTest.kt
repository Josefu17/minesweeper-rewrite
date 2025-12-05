package minesweeper.application.api

import minesweeper.application.api.request.CustomConfig
import minesweeper.application.api.request.NewGameRequest
import minesweeper.domain.BlockType
import minesweeper.domain.Difficulty
import minesweeper.infrastructure.repository.ScoreRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class GameServiceTest {

    private val scoreRepository = mock(ScoreRepository::class.java)
    private val service = GameService(scoreRepository)

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