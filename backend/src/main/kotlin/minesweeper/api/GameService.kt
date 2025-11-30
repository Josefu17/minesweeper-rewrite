package minesweeper.api

import minesweeper.api.response.CellDto
import minesweeper.api.response.GameStateDto
import minesweeper.api.request.NewGameRequest
import minesweeper.core.Coordinate
import minesweeper.core.Difficulty
import minesweeper.core.MinesweeperGame
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class GameService {
    private val logger = LoggerFactory.getLogger(GameService::class.java)
    private val games = mutableMapOf<String, MinesweeperGame>()

    fun createGame(request: NewGameRequest): GameStateDto {
        val config = resolveConfig(request)

        val id = UUID.randomUUID().toString()

        val game = MinesweeperGame(
            rows = config.rows,
            columns = config.columns,
            mineCount = config.mines,
            lives = config.lives
        )

        games[id] = game
        logger.info("Created game: $id")
        return toGameStateDto(id, game)
    }

    fun getGameState(id: String): GameStateDto? =
        games[id]?.let { toGameStateDto(id, it) }

    fun reveal(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        if (isValidCoordinate(game, x, y, "Reveal")) {
            game.reveal(Coordinate(x, y))
        }
        return toGameStateDto(id, game)
    }

    fun toggleMark(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        if (isValidCoordinate(game, x, y, "Mark")) {
            game.toggleMark(Coordinate(x, y))
        }
        return toGameStateDto(id, game)
    }

    fun autoExpand(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        if (isValidCoordinate(game, x, y, "AutoExpand")) {
            game.autoExpand(Coordinate(x, y))
        }
        return toGameStateDto(id, game)
    }

    private fun isValidCoordinate(game: MinesweeperGame, x: Int, y: Int, action: String): Boolean {
        if (game.world.isOutOfBounds(Coordinate(x, y))) {
            logger.warn("Invalid '$action' request: Coordinate $x,$y is out of bounds. GameID ignored.")
            return false
        }
        return true
    }

    private fun toGameStateDto(id: String, game: MinesweeperGame): GameStateDto {
        val world = game.world
        val grid = (0 until world.rows).map { r ->
            (0 until world.columns).map { c ->
                val block = world.getBlock(r, c)
                CellDto(
                    x = block.coordinate.x,
                    y = block.coordinate.y,
                    state = block.state,
                    adjacentMines = block.adjacentMines
                )
            }
        }

        return GameStateDto(
            id = id,
            status = game.status,
            livesLeft = game.livesLeft,
            rows = world.rows,
            columns = world.columns,
            mineCount = world.mineCount,
            marksLeft = world.marksLeft,
            grid = grid
        )
    }

    private data class GameConfig(val rows: Int, val columns: Int, val mines: Int, val lives: Int)

    private fun resolveConfig(req: NewGameRequest): GameConfig {
        return when (req.difficulty) {
            Difficulty.EASY -> GameConfig(rows = 9, columns = 9, mines = 10, lives = 1)
            Difficulty.MEDIUM -> GameConfig(rows = 16, columns = 16, mines = 40, lives = 1)
            Difficulty.HARD -> GameConfig(rows = 16, columns = 30, mines = 99, lives = 0)
            Difficulty.CUSTOM -> {
                // Validation for Custom Mode
                val r = (req.rows).coerceIn(5, 30)
                val c = (req.columns).coerceIn(5, 30)

                // Ensure we don't have more mines than cells (leave at least 9 for the start area)
                val maxMines = (r * c) - 9
                val m = (req.customMines ?: 10).coerceIn(1, maxMines)

                val l = (req.customLives ?: 1).coerceIn(0, 3)

                GameConfig(r, c, m, l)
            }
        }

    }
}
