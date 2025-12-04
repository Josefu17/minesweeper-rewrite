package minesweeper.api

import minesweeper.application.api.request.NewGameRequest
import minesweeper.application.api.response.CellDto
import minesweeper.application.api.response.GameStateDto
import minesweeper.domain.Coordinate
import minesweeper.domain.Difficulty
import minesweeper.domain.GameStatus
import minesweeper.domain.MinesweeperGame
import minesweeper.infrastructure.model.Score
import minesweeper.infrastructure.repository.ScoreRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Duration
import java.util.UUID

@Service
class GameService(
    private val scoreRepository: ScoreRepository
) {
    private val logger = LoggerFactory.getLogger(GameService::class.java)
    private val games = mutableMapOf<String, GameContext>()

    private data class GameContext(val game: MinesweeperGame, val difficulty: Difficulty)

    fun createGame(request: NewGameRequest): GameStateDto {
        val config = resolveConfig(request)
        val id = UUID.randomUUID().toString()

        val game = MinesweeperGame(
            rows = config.rows,
            columns = config.columns,
            mineCount = config.mines,
            lives = config.lives
        )

        games[id] = GameContext(game, request.difficulty)
        logger.info("Created game: $id")
        return toGameStateDto(id, game)
    }

    fun getGameState(id: String): GameStateDto? =
        games[id]?.let { toGameStateDto(id, it.game) }

    fun reveal(id: String, x: Int, y: Int): GameStateDto? {
        val ctx = games[id] ?: return null
        if (isValidCoordinate(id, ctx.game, x, y, "Reveal")) {
            ctx.game.reveal(Coordinate(x, y))
        }
        return toGameStateDto(id, ctx.game)
    }

    fun toggleMark(id: String, x: Int, y: Int): GameStateDto? {
        val ctx = games[id] ?: return null
        if (isValidCoordinate(id, ctx.game, x, y, "Mark")) {
            ctx.game.toggleMark(Coordinate(x, y))
        }
        return toGameStateDto(id, ctx.game)
    }

    fun autoExpand(id: String, x: Int, y: Int): GameStateDto? {
        val ctx = games[id] ?: return null
        if (isValidCoordinate(id, ctx.game, x, y, "AutoExpand")) {
            ctx.game.autoExpand(Coordinate(x, y))
        }
        return toGameStateDto(id, ctx.game)
    }

    // --- SCORE SUBMISSION ---
    fun submitScore(gameId: String, playerName: String): Score? {
        val ctx = games[gameId] ?: return null
        val game = ctx.game

        if (game.status != GameStatus.WON) {
            logger.warn("Attempt to submit score for non-won game: $gameId")
            return null
        }

        val start = game.startedAt
        val end = game.finishedAt

        if (start == null || end == null) {
            logger.warn("Cannot score game without timestamps")
            return null
        }

        val seconds = Duration.between(start, end).toSeconds()

        val score = Score(
            playerName = playerName,
            difficulty = ctx.difficulty,
            timeSeconds = seconds
        )

        return scoreRepository.save(score)
    }

    private fun isValidCoordinate(gameId: String, game: MinesweeperGame, x: Int, y: Int, action: String): Boolean {
        if (game.world.isOutOfBounds(Coordinate(x, y))) {
            logger.warn("For: $gameId: Invalid '$action' request: Coordinate $x,$y is out of bounds. Ignored.")
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
        // ... (Same logic as your existing code) ...
        // For brevity in this diff, assuming this is unchanged from previous step
        return when (req.difficulty) {
            Difficulty.EASY -> GameConfig(rows = 9, columns = 9, mines = 10, lives = 1)
            Difficulty.MEDIUM -> GameConfig(rows = 16, columns = 16, mines = 40, lives = 1)
            Difficulty.HARD -> GameConfig(rows = 16, columns = 30, mines = 99, lives = 0)
            Difficulty.CUSTOM -> {
                val config = req.customConfig!!
                val r = config.rows
                val c = config.columns
                val maxMines = (r * c) - 9
                val requestedMines = config.customMines
                val m = requestedMines.coerceIn(1, maxMines)
                val l = config.customLives
                GameConfig(r, c, m, l)
            }
        }
    }
}