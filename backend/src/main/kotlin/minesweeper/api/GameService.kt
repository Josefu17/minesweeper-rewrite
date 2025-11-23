package minesweeper.api

import minesweeper.core.Coordinate
import minesweeper.core.Difficulty
import minesweeper.core.MinesweeperGame
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class GameService {

    // in memory for now; persistable if desired later, yb
    private val games = mutableMapOf<String, MinesweeperGame>()

    fun createGame(gameInfo: GameInfo): String {
        val id = UUID.randomUUID().toString()
        games[id] = MinesweeperGame(gameInfo.rows, gameInfo.columns, gameInfo.difficulty)

        return id
    }

    fun getGame(id: String): MinesweeperGame? = games[id]

    fun reveal(id: String, x: Int, y: Int) {
        val game = games[id] ?: return
        game.reveal(Coordinate(x, y))
    }

    fun toggleMark(id: String, x: Int, y: Int) {
        val game = games[id] ?: return
        game.toggleMark(Coordinate(x, y))
    }

    fun autoExpand(id: String, x: Int, y: Int) {
        val game = games[id] ?: return
        game.autoExpand(Coordinate(x, y))
    }
}

data class GameInfo(
    val rows: Int,
    val columns: Int,
    val difficulty: Difficulty
)