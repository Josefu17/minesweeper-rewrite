package minesweeper.api

import minesweeper.api.dto.CellDto
import minesweeper.api.dto.GameStateDto
import minesweeper.api.dto.NewGameRequest
import minesweeper.core.Coordinate
import minesweeper.core.MinesweeperGame
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class GameService {
    private val logger = LoggerFactory.getLogger(GameService::class.java)
    private val games = mutableMapOf<String, MinesweeperGame>()

    fun createGame(request: NewGameRequest): GameStateDto {
        val id = UUID.randomUUID().toString()

        val game = MinesweeperGame(request.rows, request.columns, request.difficulty)
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
}