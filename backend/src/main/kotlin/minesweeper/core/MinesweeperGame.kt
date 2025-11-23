package minesweeper.core

import org.slf4j.LoggerFactory

class MinesweeperGame(rows: Int, columns: Int, difficulty: Difficulty) {
    private val logger = LoggerFactory.getLogger(MinesweeperGame::class.java)
    val world = World(rows, columns, difficulty)

    var livesLeft: Int = difficulty.lives
        private set
    var status: GameStatus = GameStatus.RUNNING
        private set
    private var isFirstMove: Boolean = true

    fun reveal(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) {
            logger.info("Reveal called for out of bounds coordinate: ${c.x}x${c.y}. Ignoring.")
            return
        }

        // Guard: Don't reveal flags or already revealed
        val currentState = world.getState(c)
        if (currentState != BlockType.HIDDEN) return

        if (isFirstMove) {
            world.plantMines(c)
            isFirstMove = false
        }

        if (world.hasMine(c)) {
            world.setExploded(c)
            handleMineHit(1, c)
        } else {
            world.reveal(c)
            checkWin()
        }
    }

    fun toggleMark(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) return

        when (world.getState(c)) {
            BlockType.HIDDEN -> world.mark(c)
            BlockType.FLAGGED -> world.unmark(c)
            else -> {} // Do nothing for REVEALED or MINE
        }
    }

    fun autoExpand(c: Coordinate) {
        if (status != GameStatus.RUNNING) return
        if (world.isOutOfBounds(c)) return

        val minesHit = world.forceExpand(c)

        if (minesHit > 0) {
            handleMineHit(minesHit, c)
        } else if (minesHit == 0) {
            // If expand was valid and safe, check win
            checkWin()
        }
        // if -1, invalid expand, do nothing // TODO add log, yb
    }

    private fun checkWin() {
        if (world.won()) {
            status = GameStatus.WON
            logger.info("Game WON!")
        }
    }

    private fun handleMineHit(hitMines: Int, at: Coordinate) {
        if (hitMines > livesLeft || livesLeft == 0) {
            status = GameStatus.LOST
            logger.info("Game LOST at $at")
        } else {
            livesLeft = 0
            // Logic: You hit a mine, but survived.
            // The mine is now visible (EXPLODED state), but game is RUNNING.
            // We usually decrement the mark counter to indicate a "flag" was technically used/lost here?
            // Or just leave it as is.
            logger.info("Extra life used!")
        }
    }
}