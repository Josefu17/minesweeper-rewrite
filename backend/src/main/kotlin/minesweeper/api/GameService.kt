package minesweeper.api

import minesweeper.api.dto.CellDto
import minesweeper.api.dto.GameStateDto
import minesweeper.api.dto.NewGameRequest
import minesweeper.core.BlockType.REVEALED
import minesweeper.core.Coordinate
import minesweeper.core.MinesweeperGame
import org.springframework.stereotype.Service
import java.util.UUID

// TODO configure map not null globally in json, yb

@Service
class GameService {

    // in memory for now; persistable if desired later, yb
    private val games = mutableMapOf<String, MinesweeperGame>()

    fun createGame(request: NewGameRequest): GameStateDto {
        val id = UUID.randomUUID().toString()
        val game = MinesweeperGame(request.rows, request.columns, request.difficulty)
        games[id] = game

        return toGameStateDto(id, game)
    }

    fun getGameState(id: String): GameStateDto? {
        val game = games[id] ?: return null
        return toGameStateDto(id, game)
    }

    fun reveal(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        game.reveal(Coordinate(x, y))
        return toGameStateDto(id, game)
    }

    fun toggleMark(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        game.toggleMark(Coordinate(x, y))
        return toGameStateDto(id, game)
    }

    fun autoExpand(id: String, x: Int, y: Int): GameStateDto? {
        val game = games[id] ?: return null
        game.autoExpand(Coordinate(x, y))
        return toGameStateDto(id, game)
    }

    private fun toGameStateDto(id: String, game: MinesweeperGame): GameStateDto {
        val world = game.world

        val grid: List<List<CellDto>> =
            (0 until world.rows).map { r ->
                (0 until world.columns).map { c ->
                    val block = world.getBlock(r, c)
                    CellDto(
                        x = block.coordinate.x,
                        y = block.coordinate.y,
                        state = block.state,
                        adjacentMines = if (block.state == REVEALED) block.adjacentMines else null
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
